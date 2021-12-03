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
    res.send({data: result});
  })
})

app.post('/createTask', (req, res) => {
  const task = new Task(req.body);
  task.save().then(result => {
    res.send({data: result});
  })
})

app.delete('/deleteTask', (req, res) => {
  const identifier = req.query.id;
  if(identifier === undefined) {
    res.send("Пожалуйста, заполните id")
  } else {
    Task.deleteOne({_id : identifier})
    .then(result => {
      console.log('Task deleted');
    })
    Task.find().then(result => {
      res.send({data: result});
    })
  }
})

app.patch('/updateTask', (req, res) => {
  const params = req.query.id;
  const body = req.body;
  if(req.body.text === undefined) {
    res.send("Пожалуйста, заполните текст")
  } else {
    Task.findByIdAndUpdate(params, { text: body.text })
    .then(result => {
      console.log('Task was updated');
    })
    Task.find().then(result => {
      res.send({data: result});
    })
  }
})

app.put('/changeCheckbox', (req, res) => {
  const body = req.body;
  const task = body._id;
  Task.findByIdAndUpdate(task, {isCheck: body.isCheck}).then(result => {
    res.send('Checkbox was changed');
  })
})

app.listen('8000', () => {
  console.log('Example app listening on port 8000!')
});
