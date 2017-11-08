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
    it('returns with an array of articles', () => {
      return request(app)
        .get('/api/articles')
        .then(res => {
          const {articles} = res.body;
          expect(articles).to.be.an('array');
          expect(articles[0].title).to.be.a('string');
          expect(articles.length).to.equal(2);
        });
    });
  });
  describe('GET api/:article_id/comments', () => {
    it('returns with a status code of 200 if successful', () => {
      const article_id = usefulData.articles[0]._id;
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200);
    });
    it('returns with an array of comments', () => {
      const article_id = usefulData.articles[0]._id;
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .then(({body}) => {
          const {comments} = body;
          expect(comments).to.be.a('array');
          expect(comments.length).to.equal(2);
        });
    });
    it('returns with a status code of 404 if given an invalid article_id', () => {
      return request(app)
        .get('/api/aricles/test/comments')
        .expect(404)
        .then(res => {
          const {message} = res.body;
          expect(message).to.eql( 'Page not found');
        });
    });
  });
  describe('POST api/:article_id/comments', () => {
    it('it returns with a status code of 201 if successful', () => {
      const article_id = usefulData.articles[0]._id;
      const comment = 'this is a test comment';
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send({
          comment
        })
        .expect(201);
    });
    it('returns the comment after successful post', () => {
      const article_id = usefulData.articles[0]._id;
      const comment = 'this is a test comment';
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send({
          comment
        })
        .then((res) => {
          const {body} = res.body.comment;
          expect(body).to.equal(comment);
        });
    });
    it('returns with a 400 status code if posting an invalid comment', () => {
      const article_id = usefulData.articles[0]._id;
      const comment = '   ';
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send({
          comment
        })
        .expect(400)
        .then(res => {
          const {message} = res.body;
          expect(message).to.equal('INVALID INPUT');
        });
    });
    it('returns with a 400 status code if posting with no comment', () => {
      const article_id = usefulData.articles[0]._id;
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send({})
        .expect(400)
        .then(res => {
          const {message} = res.body;
          expect(message).to.equal('INVALID INPUT');
        });
    });
  });
  describe('PUT api/:article_id?vote=up', () => {
    it('it returns with a status code of 200 if successful and the updated article', () => {
      const article_id = usefulData.articles[0]._id;
      const oldVotes = usefulData.articles[0].votes;
      return request(app)
        .put(`/api/articles/${article_id}?vote=up`)
        .expect(200)
        .then(res => {
          const {votes} = res.body;
          expect(votes).to.equal(oldVotes + 1);
        });
    });
    it('it returns with a status code of 404 if the article_id is not found', () => {
      return request(app)
        .put('/api/articles/test?vote=up')
        .expect(404)
        .then(({body}) => {
          expect(body.message).to.equal('ARTICLE_ID NOT FOUND');
        });
    });
  });
});