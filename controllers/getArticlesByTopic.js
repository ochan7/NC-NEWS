const {Articles} = require('../models');

module.exports = (req, res, next) => {
  const {topic: belongs_to} = req.params;
  Articles.find({belongs_to})
    .then(articles => {
      if(articles.length === 0) return next({status: 404, message: 'TOPIC DOES NOT EXIST'});
      res.status(200).send({articles});
    })
    .catch(err => {
      if(err) next(err);
    });
};
