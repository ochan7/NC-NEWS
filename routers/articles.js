const router = require('express').Router();
const {getAllArticles, getComments, postComment} = require('../controllers');
router.route('/')
  .get(getAllArticles);
router.route('/:article_id/comments')
  .get(getComments)
  .post(postComment);
module.exports = router;