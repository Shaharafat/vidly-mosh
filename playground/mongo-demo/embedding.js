const mongoose = require('mongoose');

// connect mongoose
mongoose
  .connect('mongodb://localhost/playground', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model('Author', authorSchema);

//! work with sub document
// const Course = mongoose.model(
//   'Course',
//   new mongoose.Schema({
//     name: String,
//     author: authorSchema, //! put whole author document here.
//   })
// );

// work with array of sub documents
const Course = mongoose.model(
  'Course',
  new mongoose.Schema({
    name: String,
    author: [authorSchema], //! put whole author document here.
  })
);

//! work with single sub document
// async function createCourse(name, author) {
//   const course = new Course({
//     name,
//     author,
//   });

//   const result = await course.save();
//   console.log(result);
// }

// ! work with arry of sub documents
async function createCourse(name, authors) {
  const course = new Course({
    name,
    author: authors,
  });

  const result = await course.save();
  console.log(result);
}

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);
  course.author.push(author);
  course.save();
}

async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);
  const author = course.author.id(authorId);
  author.remove();
  course.save();
}

async function listCourses() {
  // populating data from other collection.
  // .populate('field', 'property name')
  const courses = await Course.find().populate('author', 'name -_id').select('name author');
  console.log(courses);
}

async function updateAuthor(courseId) {
  const course = await Course.findById(courseId);
  course.author.name = 'Mosh Hamedani'; // updating data
  course.save(); // saving course
}

async function updateAuthorDirectly(courseId) {
  await Course.updateOne(
    { _id: courseId },
    {
      // $unset: {
      //   'author':""
      // },
      $set: {
        'author.name': 'John Smith',
      },
    }
  );
}

// createAuthor('Mosh', 'My bio', 'My website');

// createCourse('Node Course', new Author({ name: 'Mosh' }));

// listCourses();

// updateAuthor('60327215521abbb8847edaab');

// updateAuthorDirectly('60327215521abbb8847edaab');

// createCourse('Node Course', [
//   new Author({ name: 'Mosh' }),
//   new Author({ name: 'Gary Simon' }),
//   new Author({ name: 'Brad Traversy' }),
// ]);

// addAuthor('60328e328bad9db4d8c2d346', new Author({ name: 'Arafat' }));

// removeAuthor('60328e328bad9db4d8c2d346', '60328fc1d292128d78f19bda');
