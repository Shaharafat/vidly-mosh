const express = require('express');
const Joi = require('joi');
const morgan = require('morgan');
// const debug = require('debug')('app:startup'); // debug namespace create

const app = express();

app.use(express.json());

// use morgan
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  // debug('morgan enabled...'); // use debug here
}

const courses = [
  { id: 1, name: 'React' },
  { id: 2, name: 'React Native' },
  { id: 3, name: 'Python' },
  { id: 4, name: 'Django' },
];

const validateCourse = (course) => {
  // validate
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const { error, value } = schema.validate(course);
  return [error, value];
};

// update course
app.put('/api/courses/:id', (req, res) => {
  // find the course
  const course = courses.find((c) => c.id === parseInt(req.params.id, 10));
  // if course not found, throw error
  if (!course) return res.status(404).send('The course is not found');

  // validate course
  const [error] = validateCourse(req.body);

  // if error found then return error message
  // else push data to course and send
  if (error) {
    const {
      details: [{ message }],
    } = error;
    res.status(400).send(message);
    return;
  }

  // update course
  course.name = req.body.name;
  // return the updated course
  res.send(course);
});

// add coruse
app.post('/api/courses', (req, res) => {
  const [error, value] = validateCourse(req.body);

  const course = {
    id: courses.length + 1,
    ...value,
  };

  // if error found then return error message
  // else push data to course and send
  if (error) {
    const {
      details: [{ message }],
    } = error;
    res.status(400).send(message);
    return;
  }

  courses.push(course);
  res.send(course);
});

// get individual
app.get('/api/courses/:id', (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id, 10));
  // if course not found, throw error
  if (!course) return res.status(404).send('The course is not found');
  res.send(course);

  // delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

// get all data
app.get('/api/courses', (req, res) => {
  res.send(courses);
});

// delete course
app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id, 10));
  // if course not found, throw error
  if (!course) return res.status(404).send('The course is not found');
  res.send(course);
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
