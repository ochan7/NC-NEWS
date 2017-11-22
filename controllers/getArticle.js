const {Articles} = require('../models');

module.exports = (req, res, next) => {
  const {article_id: id} = req.params;
  Articles.findById(id)
    .then(article => {
      res.send({article});
    })
    .catch(err => {
      if(err) return next(err);
    });
};