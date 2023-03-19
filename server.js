//server javascript file
// Imports necessary Dependencies.
const express = require("express");
const path = require("path");
const fs = require("fs");

// Reads a JavaScript file, executes it, and then proceeds to return the export JSON objects.
const notesData = require("./db/db.json");

// Sets Port.
const PORT = process.env.PORT || 3001;

// This will create an express server.
const app = express();

app.use(express.static("public"));

app.get("/api/notes", (req, res) => {
    res.json(notesData.slice(1));
});

// middeware - parses string or array.
app.use(express.urlencoded({extended: true}));

//Parsing JSON data.
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Function to allow users to save new notes.
function createNewNotes(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];
    
    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}

//Post method will bring user input to db.  
app.post("/api/notes", (req, res) => {
    const newNote = createNewNotes(req.body, notesData);
    res.json(newNote);
});

// Function to allow notes to be deleted from previous notes.
function deleteExistingNotes(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
}

// Delete method will allow user to delete previous saved notes.
app.delete('/api/notes/:id', (req, res) => {
    deleteExistingNotes(req.params.id, notesData);
    res.json(true);
});

// Application listner
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT} 🚀`);
});