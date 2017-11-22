const {Comments} = require('../models');

module.exports = (req, res, next) => {
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
};