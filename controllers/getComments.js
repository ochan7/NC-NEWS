const {Comments} = require('../models');

module.exports = (req, res, next) => {
  const {article_id: belongs_to} = req.params;
  Comments.find({belongs_to})
    .then(comments => {
      res.status(200).send({comments: comments.sort((a,b) => b.created_at - a.created_at)});
    })
    .catch(err => {
      if(err.name === 'CastError')   next({status: 404, message: 'ARTICLE_ID NOT FOUND'});
      else next(err);
    });
};