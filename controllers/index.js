const {Articles, Comments} = require('../models/models');

module.exports = {
  getAllArticles: (req, res) => {
    Articles.find()
      .then(articles => {
        res.status(200).send({articles});
      });
  },
  getComments: (req, res, next) => {
    const {article_id: belongs_to} = req.params;
    Comments.find({belongs_to})
      .then(comments => {
        res.status(200).send({comments});
      })
      .catch(err => {
        if(err.name === 'CastError')   next({status: 404, message: 'ARTICLE_ID NOT FOUND'});
        else next(err);
      });
  },
  postComment: (req, res, next) => {
    const {article_id} = req.params;
    const {comment, created_by = 'northcoder'} = req.body;
      
    if(/^\s*$/.test(comment)) return next({status: 400, message: 'INVALID INPUT'});
      
    const newComment = new Comments({body:comment, created_by, belongs_to: article_id});
      
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
      .then(comment => res.send(comment))
      .catch(err => {
        if(err.name === 'CastError') return next({status: 404, message: 'ARTICLE_ID NOT FOUND'});
        return next(err);
      });
  }
};