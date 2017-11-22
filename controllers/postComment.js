const {Comments} = require('../models');

module.exports = (req, res, next) => {
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
};