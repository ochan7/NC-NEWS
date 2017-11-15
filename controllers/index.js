const {Articles, Comments, Topics, Users} = require('../models/models');

module.exports = {
  getAllArticles: (req, res) => {
    Articles.find()
      .then(articles => {
        res.status(200).send({articles});
      });
  },
  getArticle: (req, res, next) => {
    const {article_id: id} = req.params;
    Articles.findById(id)
      .then(article => {
        res.send({article});
      })
      .catch(err => {
        if(err) return next(err);
      });
  },
  getComments: (req, res, next) => {
    const {article_id: belongs_to} = req.params;
    Comments.find({belongs_to})
      .then(comments => {
        res.status(200).send({comments: comments.sort((a,b) => b.created_at - a.created_at)});
      })
      .catch(err => {
        if(err.name === 'CastError')   next({status: 404, message: 'ARTICLE_ID NOT FOUND'});
        else next(err);
      });
  },
  postComment: (req, res, next) => {
    const {article_id} = req.params;
    const {comment, created_by = 'northcoder', created_at = Date.now()} = req.body;
      
    if(/^\s*$/.test(comment)) return next({status: 400, message: 'INVALID INPUT'});
      
    const newComment = new Comments({body:comment, created_by, belongs_to: article_id, created_at});
      
    newComment.save()
      .then(comment => {
        res.status(201).send({comment});
      })
      .catch(err => {
        if(err.name === 'ValidationError')   next({status: 400, message: 'INVALID INPUT'});
        return next(err);
      });
  },
  putArticle: (req, res, next) => {
    const {article_id: id} = req.params;
    const {vote} = req.query;
    let increment = 0;

    if(vote === 'up') increment = 1;
    else if(vote === 'down') increment = -1;

    Articles.findByIdAndUpdate(id, {$inc: {votes: increment}}, {new: true})
      .then(article => res.send({article}))
      .catch(err => {
        if(err.name === 'CastError') return next({status: 404, message: 'ARTICLE_ID NOT FOUND'});
        return next(err);
      });
  },
  getAllTopics: (req, res, next) => {
    Topics.find()
      .then(topics => {
        res.status(200).send({topics});
      })
      .catch(err => {
        if(err) next(err);
      });
  },
  getArticlesByTopic: (req, res, next) => {
    const {topic: belongs_to} = req.params;
    Articles.find({belongs_to})
      .then(articles => {
        if(articles.length === 0) return next({status: 404, message: 'TOPIC DOES NOT EXIST'});
        res.status(200).send({articles});
      })
      .catch(err => {
        if(err) next(err);
      });
  },
  putComment: (req, res, next) => {
    const {comment_id: id} = req.params;
    const {vote} = req.query;
    let increment;
    if(vote === 'up') increment = 1;
    else if (vote === 'down') increment = -1;
    Comments.findByIdAndUpdate(id, {$inc: {votes: increment}}, {new: true})
      .then(comment => {
        res.status(200).send({comment});
      })
      .catch(err => {
        if(err.name === 'CastError') return next({status: 404, message: 'COMMENT_ID NOT FOUND'});
        return next(err);
      });
  },
  deleteComment: (req, res, next) => {
    const {comment_id: id} = req.params;
    Comments.findByIdAndRemove(id)
      .then(comment => {
        res.status(204).send();
      })
      .catch(err => {
        if(err.name === 'CastError') return next({status: 404, message: 'COMMENT_ID NOT FOUND'});
        return next(err);
      });
  },
  getAllUsers: (req, res, next) => {
    Users.find()
      .then(users => {
        res.status(200).send({users});
      })
      .catch(err => {
        if(err) return next(err);
      });
  },
  getUser: (req, res, next) => {
    const {username} = req.params;
    Users.find({username})
      .then(users => {
        if(users.length === 0) return next({status: 404, message: 'USERNAME NOT FOUND'});
        res.status(200).send({users});
      })
      .catch(err => {
        if(err) return next(err);
      });
  }
};