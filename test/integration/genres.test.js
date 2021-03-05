/*
 *
 * Title: genres test case
 * Description: test case written for genres API
 * Author: Shah Arafat
 * Date: 28-02-2021
 *
 */

//  dependencies
const request = require('supertest');
const mongoose = require('mongoose');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');

describe('/api/genres', () => {
  let server;
  // start server before each test case
  beforeEach(() => {
    server = require('../../index');
  });
  // close after each test done
  afterEach(async () => {
    await server.close();
    await Genre.remove({});
  });

  describe('GET /', () => {
    test('should return all genres', async () => {
      // insert several genre
      await Genre.collection.insertMany([{ name: 'genre1' }, { name: 'genre2 ' }]);
      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === 'genre1')).toBeTruthy(); // ! see
    });
  });

  // own
  describe('GET /:id', () => {
    test('should return a genre if valid id is passed', async () => {
      // insert several genre
      const genre = new Genre({ name: 'genre1' });
      await genre.save();
      const res = await request(server).get(`/api/genres/${genre._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', genre.name);
    });

    test('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/genres/1');

      expect(res.status).toBe(404);
    });

    test('should return 404 if no genre with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get(`/api/genres/${id}`);

      expect(res.status).toBe(404);
    });
  });

  // 🧪 POST TEST
  describe('POST /', () => {
    let token;
    let name;

    const exec = () =>
      request(server).post('/api/genres').set('x-auth-token', token).send({ name });

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'genre1';
    });

    test('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();
      expect(res.status).toBe(401);
    });

    test('should return 400 if genre is less than 5 characters', async () => {
      name = '1234';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should return 400 if genre is more than 50 characters', async () => {
      name = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    test('should save if it is valid', async () => {
      await exec();
      const genre = await Genre.find({ name: 'genre1' });

      expect(genre).not.toBeNull();
    });

    test('should return the genre if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });
});
