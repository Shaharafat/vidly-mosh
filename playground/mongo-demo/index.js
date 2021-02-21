const mongoose = require('mongoose');

// connect mongoose
mongoose
  .connect('mongodb://localhost/playground', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// create schema
const courseSchema = new mongoose.Schema({
  // added validation in schema
  name: {
    type: String,
    minLength: 3,
    maxLength: 20,
    required: true,
    // match: /pattern/
  },
  category: {
    type: String,
    enum: ['Web', 'UI', 'UX'],
    required: true,
  },
  author: String,
  // tags: [String],
  tags: {
    type: Array,
    // !custom validator
    validate: {
      validator(v) {
        return v && v.length;
      },
      message: 'A Course should have at least one tag',
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    min: 10,
    max: 100,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
    required() {
      return this.isPublished;
    },
  },
});

// create model. Model is besically a class created on top of schema
const Course = mongoose.model('Course', courseSchema);

// create and save course
const createCourse = async () => {
  const course = new Course({
    name: 'Angular JS',
    category: 'UX',
    author: 'Simon',
    // tags: ['Design'],
    isPublished: true,
    price: 12,
  });

  // if there is an error then show error message
  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    for (prop in ex.errors) {
      console.log(ex.errors[prop].properties.message);
    }
  }
};

createCourse();

// query document
const getCourses = async () => {
  const courses = await Course.find({ isPublished: true }) // only published course
    .limit(5)
    .sort({ name: 1 }) // 1-asc, -1-desc
    .select({ name: 1, tags: 1 }); // which proprty to show
  console.log(courses);
};

// getCourses();

// complex query
const getCourse = async () => {
  const course = await Course.find({ price: { $gt: 10 } }) // here comparison operator used
    .limit(5)
    .sort({ name: 1 })
    .select({ name: 1 });
  console.log(course);
};

// ! update course in query first appraoch
const updateCourse = async (id) => {
  // find by Id
  // update
  // save
  const course = await Course.findById(id);
  if (!course) return;

  course.isPublished = false;
  course.author = 'Shah Arafat';

  // Course.setMaxListeners({
  //   isPublished: false,
  //   author: 'Shah Arafat',,
  // });

  const result = await course.save();
  console.log(result);
};

// updateCourse('6030e1edd1dc07355c54a01b');

const directUpdate = async (id) => {
  const result = await Course.update(
    { _id: id },
    {
      $set: {
        isPublished: false,
        name: 'Rony',
      },
    }
  );
  console.log(result);
};

// directUpdate('6030deb5bdd5726034ef0879');

const directUpdateAndShow = async (id) => {
  const updatedCourse = await Course.findByIdAndUpdate(
    id,

    {
      $set: {
        isPublished: true,
        name: 'Brad',
      },
    },
    { new: true },
  );
  console.log(updatedCourse);
};

// directUpdateAndShow('6030deb5bdd5726034ef0879')

const deleteCourse = async (id) => {
  const result = await Course.deleteOne({ _id: id });
  // or
  // const result = await Course.deleteMany({ isPublished:false });
  // or
  // const result = await Course.findByIdAndRemove(id);
  console.log(result);
};

// deleteCourse('6030e1edd1dc07355c54a01b');
