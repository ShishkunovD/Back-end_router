const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();
const Schema = mongoose.Schema;

const taskScheme = new Schema({
  text: String,
  isCheck: Boolean
})

const Task = mongoose.model("tasks", taskScheme);

app.use(cors());

const url = 'mongodb+srv://ShishkunovD:restart987!@cluster0.8tbt5.mongodb.net/Todo-list-JS?retryWrites=true&w=majority';
mongoose.connect(url);

app.use(express.json());

app.get('/allTasks', (req, res) => {
  Task.find().then(result => {
    res.send({ data: result });
  })
})

app.post('/createTask', (req, res) => {
  const task = new Task(req.body);
  if(req.body.text === undefined || typeof req.body.isCheck !== "boolean") {
    res.status(404).send("Error, all fields should be filled in correctly.");
  } else {
    task.save().then(result => {
      res.send({ data: result });
    })
  }
})

app.delete('/deleteTask', (req, res) => {
  const identifier = req.query.id;
  if(identifier === undefined) {
    res.status(404).send("Error, please enter the id.");
  } else {
    Task.deleteOne({ _id : identifier })
    .then(result => {
      Task.find().then(result => res.send({ data: result }));
    })
  }
})

app.patch('/updateTask', (req, res) => {
  const params = req.query.id;
  const body = req.body;
  if(body.text === undefined || params === undefined || typeof body.isCheck !== "boolean") {
    res.status(404).send("Error, all fields should be filled.");
  } else {
    Task.findByIdAndUpdate(params, { text: body.text })
    .then(result => {
      Task.find().then(result => res.send({ data: result }))
    })
  }
})

app.listen('8000', () => {
  console.log('Example app listening on port 8000!')
});
