const {Comments} = require('../models');

module.exports = (req, res, next) => {
  const {comment_id: id} = req.params;
  Comments.findByIdAndRemove(id)
    .then(comment => {
      if(!comment) return next({status: 404, message: 'COMMENT_ID NOT FOUND'});
      res.status(204).send();
    })
    .catch(err => {
      if(err.name === 'CastError') return next({status: 404, message: 'COMMENT_ID NOT FOUND'});
      return next(err);
    });
};