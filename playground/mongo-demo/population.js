const mongoose = require('mongoose');

// connect mongoose
mongoose
  .connect('mongodb://localhost/playground', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

const Author = mongoose.model(
  'Author',
  new mongoose.Schema({
    name: String,
    bio: String,
    website: String,
  })
);

const Course = mongoose.model(
  'Course',
  new mongoose.Schema({
    name: String,
    author: {
      type: mongoose.Schema.Types.ObjectId, //! use object id
      ref: 'Author', //! of author model
    },
  })
);

async function createAuthor(name, bio, website) {
  const author = new Author({
    name,
    bio,
    website,
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name,
    author,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  // populating data from other collection.
  // .populate('field', 'property name')
  const courses = await Course.find().populate('author', 'name -_id').select('name author');
  console.log(courses);
}

// createAuthor('Mosh', 'My bio', 'My website');

// createCourse('Node Course', '603263058d0f7ea65803aebc');

// listCourses();
