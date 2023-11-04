const express = require('express');
const noteData = require('./db/db.json');
const path = require('path');
const uuid = require('./helpers/uuid')
// const fs = require('fs');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/pages/notes.html'))
);

app.get('/api/notes', (req, res) => {
    res.status(200).json(noteData);
});

app.post('/api/notes', (req, res) => {
    console.log('Submission Received...');

    const { title, text } = req.body;
  
    if (title && text) {

        const newNote = {
        title,
        text,
        id: uuid(),
      };

      readAndAppend(newNote, './db/db.json');

    //   const noteString = JSON.stringify(newNote, null, 2);

    //   fs.appendFile('./db/db.json', noteString, (err) =>
    //   err ? console.log(err) : console.log('Data successfully Written to Json'));

      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);

    } else {
      res.status(500).json('POST request failed? Oh no!');
    }
  });

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);