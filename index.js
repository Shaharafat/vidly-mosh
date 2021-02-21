/*
 *
 * Title: App
 * Description: App file
 * Author: Shah Arafat
 * Date: 19-02-2021
 *
 */
// dependencies
const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const genres = require('./routes/genres');
const customers = require('./routes/customers');

const app = express();

mongoose
  .connect('mongodb://localhost/vidly', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to mongoDB');
  })
  .catch(() => console.error('Could not connect to mongoDB...'));

app.use(express.json());
app.use(helmet());
// genres router
app.use('/api/genres', genres);
app.use('/api/customers', customers);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
