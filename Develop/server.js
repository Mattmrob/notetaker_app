const express = require('express');
const noteData = require('./db/db.json');
const path = require('path');
const uuid = require('./helpers/uuid')
const fs = require('fs');
const { readAndAppend, writeToFile } = require('./helpers/fsUtils');

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

app.get('/api/notes', async (req, res) => {
  try {
    const data = await res.status(200).json(noteData);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post('/api/notes', async (req, res) => {
  
  try {
    console.log('Submission Received...');

    const { title, text } = req.body;
  
    if (title && text) {

        const newNote = {
        title,
        text,
        id: uuid(),
      };

      await readAndAppend(newNote, './db/db.json');

      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    }
    
    } catch (error) {
      res.status(500).json(error);
    }
  });

  app.delete(`/api/notes/:id`, (req, res) => {
    if (req.params.id) {
        const selectedId = req.params.id;
        const testArray = [];
        
         for (let i = 0; i < noteData.length; i++) {
            
              if (selectedId !== noteData[i].id) {
              // code in here to delete the thing
              testArray.push(noteData[i]);
              } else {
                console.log(`${noteData[i]} has been selected for deletion `)
              }
         }

        writeToFile('./db/db.json', testArray)
        res.status(200).json(noteData)
    } else {
        res.status(500).json('Delete request failed? Oh no!')
      }
  });

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);