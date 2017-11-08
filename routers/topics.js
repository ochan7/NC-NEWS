const router = require('express').Router();
const {getAllTopics} = require('../controllers');

router.route('/')
  .get(getAllTopics);

module.exports = router;