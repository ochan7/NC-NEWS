process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const { expect } = require('chai');
const request = require('supertest');
const saveTestData = require('../seed/test.seed');
const app = require('../server');

describe('API', () => {
  let usefulData;
  beforeEach(() => {
    return mongoose.connection.dropDatabase()
      .then(saveTestData)
      .then(data => {
        usefulData = data;
      })
      .catch(err => console.log('error!', err));
  });
  describe('GET api', () => {
    it('returns with a status code of 200', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
          expect(body).to.eql({
            status: 'OK'
          });
        });
    });
  });
  describe('GET api/articles', () => {
    it('returns with a status code of 200', () => {
      return request(app)
        .get('/api/articles')
        .expect(200);
    });
  });
});