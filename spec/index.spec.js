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
  describe('GET api/article/:article_id', () => {
    it('returns with a status code of 200 if successful and the data', () => {
      const article_id = usefulData.articles[0]._id;
      return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(200)
        .then(({body: {article}}) => {
          expect(article).to.be.an('object');
        });
    });
    it('returns with a 404 if given article id is not found', () => {
      return request(app)
        .get('/api/aricles/test')
        .expect(404)
        .then(({body: {message}}) => {
          expect(message).to.eql( 'Page not found');
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
          const {votes} = res.body.article;
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
  describe('PUT api/:article_id?vote=down', () => {
    it('it returns with a status code of 200 if successful and the update article', () => {
      const article_id = usefulData.articles[0]._id;
      const oldVotes = usefulData.articles[0].votes;
      return request(app)
        .put(`/api/articles/${article_id}?vote=down`)
        .expect(200)
        .then(res => {
          const {votes} = res.body.article;
          expect(votes).to.equal(oldVotes - 1);
        });
    });
    it('it returns with a status code of 404 if the article_id is not found', () => {
      return request(app)
        .put('/api/articles/test?vote=down')
        .expect(404)
        .then(({body}) => {
          expect(body.message).to.equal('ARTICLE_ID NOT FOUND');
        });
    });
  });
  describe('GET api/topics', () => {
    it('it returns with a status code of 200 and an array of topics', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
          const {topics} = body;
          expect(topics).to.be.an('array');
          expect(topics.length).to.equal(3);
        });
    });
  });
  describe('GET api/topics/:topic/articles', () => {
    it('it returns with a status code of 200 and an array of articles', () => {
      const topic = usefulData.topics[0].slug;
      return request(app)
        .get(`/api/topics/${topic}/articles`)
        .expect(200)
        .then(({body}) => {
          const {articles} = body;
          expect(articles).to.be.an('array');
          expect(articles[0].belongs_to).to.equal(topic);
        });
    });
    it('it returns with a 404 error if given a topic that does not exist', () => {
      return request(app)
        .get('/api/topics/cheese/articles')
        .expect(404)
        .then(res => {
          const {message} = res.body;
          expect(message).to.equal('TOPIC DOES NOT EXIST');
        });
    });
  });
  describe('PUT api/comments/:comment_id?vote=up', () => {
    it('it returns with a status code of 200 and an update comment', () => {
      const { _id: comment_id, votes: oldVotes} = usefulData.comments[0]; 
      return request(app)
        .put(`/api/comments/${comment_id}?vote=up`)
        .expect(200)
        .then(({body}) => {
          const {comment} = body;
          expect(comment.votes).to.equal(oldVotes + 1);
        });
    });
    it('it returns with a 404 status code if comment_id is not found', () => {
      return request(app)
        .put('/api/comments/adfadf?vote=up')
        .expect(404);
    });
  });
  describe('PUT api/comments/:comment_id?vote=down', () => {
    it('it returns with a status code of 200 and an update comment', () => {
      const { _id: comment_id, votes: oldVotes} = usefulData.comments[0]; 
      return request(app)
        .put(`/api/comments/${comment_id}?vote=down`)
        .expect(200)
        .then(({body}) => {
          const {comment} = body;
          expect(comment.votes).to.equal(oldVotes - 1 );
        });
    });
    it('it returns with a 404 status code if comment_id is not found', () => {
      return request(app)
        .put('/api/comments/adfadf?vote=up')
        .expect(404);
    });
  });
  describe('DELETE api/comments/:comment_id', () => {
    it('returns a status code of 204', () => {
      const {_id: comment_id} = usefulData.comments[0];
      return request(app)
        .delete(`/api/comments/${comment_id}`)
        .expect(204);
    });
    it('returns a status code of 404 if the comment cannot be found', () => {
      const {_id: comment_id} = usefulData.comments[0];
      return request(app)
        .delete(`/api/comments/${comment_id}`)
        .expect(204)
        .then(() => {
          return request(app)
            .delete(`/api/comments/${comment_id}`)
            .expect(404)
            .then(({body}) => {
              expect(body.message).to.equal('COMMENT_ID NOT FOUND');
            });
        });
    });
  });
  describe('GET api/users', () => {
    it('returns a status code of 200 and an array of users', () => {  
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
          const {users} = body;
          expect(users).to.be.an('array');
        });
    });
  });
  describe('GET api/user/:username', () => {
    it('returns a status code of 200 and an array of length 1', () => {
      const {username} = usefulData.user;
      return request(app)
        .get(`/api/users/${username}`)
        .expect(200)
        .then(({body}) => {
          expect(body.users.length).to.equal(1);
          expect(body.users[0].username).to.equal(username);
        });
    });
    it('returns a 404 if given a username that does not exist', () => {
      return request(app)
        .get('/api/users/asdfad')
        .expect(404);
    });
  });
  describe('GET api/user/:username/repos', () => {
    it('returns a status code of 200 and an object containing articles and comments', () => {
      const {username} = usefulData.user;
      return request(app)
        .get(`/api/users/${username}/repos`)
        .expect(200)
        .then(({body}) => {
          expect(body.articles).to.be.an('array');
          expect(body.comments).to.be.an('array');
        });
    });
  });
});