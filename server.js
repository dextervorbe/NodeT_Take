const express = require('express');
const path = require('path');
const fs = require('fs');

// Sets up the Express App

const app = express();
const PORT = process.env.PORT || 8001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let notesData = [];

app.get('/css', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets/css/styles.css'));
});

app.get('/js', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets/js/index.js'));
});

app.get("/api/notes", function (err, res) {
  try {
    // reads the notes from json file
    notesData = fs.readFileSync("db/db.json", "utf8");
    console.log("hello!");
    // parse it so notesData is an array of objects
    notesData = JSON.parse(notesData);

    // error handling
  } catch (err) {
    console.log("\n error (in app.get.catch):");
    console.log(err);
  }
  //   send objects to the browser
  res.json(notesData);
});

app.post('/api/notes', function (req, res) {
  try {
    notesData = fs.readFileSync("db/db.json", "utf8");
    console.log(notesData);

    notesData = JSON.parse(notesData);

    req.body.id = notesData.length;

    notesData.push(req.body);

    notesData = JSON.stringify(notesData);

    fs.writeFile("db/db.json", notesData, "utf8", (err) => {
      if (err) throw err;
    });

    res.json(JSON.parse(notesData));
  } catch (err) {
    throw err;
  }

});

app.delete("/api/notes/:id", function (req, res) {
  try {

    notesData = fs.readFileSync("db/db.json", "utf8");

    notesData = JSON.parse(notesData);

    notesData = notesData.filter(function (note) {
      return note.id != req.params.id;
    });

    notesData = JSON.stringify(notesData);

    fs.writeFile("db/db.json", notesData, "utf8", function (err) {

      if (err) throw err;
    });


    res.send(JSON.parse(notesData));


  } catch (err) {
    throw err;
    console.log(err);
  }
});


app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'notes.html')));

app.get("/api/notes", (req, res) => {
  return res.sendFile(path.json(__dirname, "db/db.json"));
});


app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
