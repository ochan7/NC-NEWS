const router = require('express').Router();
const {getAllArticles, getComments} = require('../controllers');
router.route('/')
  .get(getAllArticles);
router.route('/:article_id/comments')
  .get(getComments);
module.exports = router;