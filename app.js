const express = require('express');
const bodyParser = require('body-parser');
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
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.json());

app.get('/allTasks', (req, res) => {
  Task.find().then(result => {
    res.send({data: result});
  })
})

app.post('/createTask', (req, res) => {
  const task = new Task(req.body);
  task.save().then(result => {
    res.send('Task created');
  })
})

app.delete('/deleteTask', (req, res) => {
  const identifier = req.query.id;
  Task.deleteOne({_id : identifier}).then(result => {
    res.send('Task deleted');
  });
})

app.put('/updateTask', (req, res) => {
  const task = req.body._id;
  Task.findByIdAndUpdate(task, { text : req.body.text }).then(result => {
    res.send('Task was updated');
  })
})

app.put('/changeCheckbox', (req, res) => {
  const task = req.body._id;
  Task.findByIdAndUpdate(task, {isCheck: req.body.isCheck}).then(result => {
    res.send('Checkbox was changed');
  })
})

app.listen('8000', () => {
  console.log('Example app listening on port 8000!')
});
