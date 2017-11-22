const {Topics} = require('../models');

module.exports = (req, res, next) => {
  Topics.find()
    .then(topics => {
      res.status(200).send({topics});
    })
    .catch(err => {
      if(err) next(err);
    });
};