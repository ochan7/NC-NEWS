const {Articles} = require('../models');

module.exports = (req, res) => {
  Articles.find()
    .then(articles => {
      res.status(200).send({articles});
    });
};