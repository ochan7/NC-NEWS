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


    const newComment = new Comments({body:comment, created_by, belongs_to: article_id});

    newComment.save()
      .then(data => {
        res.status(201).send(data);
      });
  }
};