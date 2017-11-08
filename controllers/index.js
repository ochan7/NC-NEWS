const {Articles} = require('../models/models');

module.exports = {
  getAllArticles: (req, res) => {
    Articles.find()
      .then(articles => {
        res.status(200).send({articles});
      });
  }
};