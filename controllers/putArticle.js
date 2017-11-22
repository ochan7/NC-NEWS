const {Articles} = require('../models');

module.exports =  (req, res, next) => {
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
};
