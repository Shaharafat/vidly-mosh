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
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');

let server;
describe('/api/genres', () => {
  // start server before each test case
  beforeEach(() => {
    server = require('../../index');
  });
  // close after each test done
  afterEach(async () => {
    server.close();
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
  });

  describe('POST /', () => {
    test('should return 401 if client is not logged in', async () => {
      const res = await request(server).post('/api/genres').send({ name: 'genre1' });
      expect(res.status).toBe(401);
    });

    test('should return 400 if genre is less than 5 characters', async () => {
      // create token
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: '1234' });
      expect(res.status).toBe(400);
    });

    test('should return 400 if genre is more than 50 characters', async () => {
      // create token
      const token = new User().generateAuthToken();

      const name = new Array(52).join('a');

      const res = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name });
      expect(res.status).toBe(400);
    });

    test('should save if it is valid', async () => {
      // create token
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'genre1' });

      const genre = await Genre.find({ name: 'genre1' });

      expect(genre).not.toBeNull();
    });

    test('should return the genre if it is valid', async () => {
      // create token
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'genre1' });

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });
});
