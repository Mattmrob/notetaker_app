const express = require('express');
const noteData = require('./db/db.json');
const path = require('path');
const uuid = require('./helpers/uuid')
const fs = require('fs');

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

      res.status(201).json(newNote);

          // fs.appendFile('./db/db.json', newNote, function (err) {
    //     if (err) throw err;
    //     console.log('Data Written');
    // });
    
    } else {
      res.status(500).json('POST request failed?');
    }
  });


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);