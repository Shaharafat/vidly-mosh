/*
 *
 * Title: authorization middleware test
 * Description: authorization middleware test
 * Author: Shah Arafat
 * Date: 03-03-2021
 *
 */
// dependencies
const request = require('supertest');
const { User } = require('../../models/user');
const { Genre } = require('../../models/genre');

let server;
describe('auth middleware', () => {
  beforeEach(() => {
    server = require('../../index');
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  let token;
  const exec = () => {
    return request(server).post('/api/genres').set('x-auth-token', token).send({ name: 'genre1' }); 
  }

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  test('should return 401 if no token is provided', async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });

  test('should return 400 if token is invalid', async () => {
    token = 'a';

    const res = await exec();
    expect(res.status).toBe(400);
  });

  test('should return 200 if token is valid', async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
