const router = require('express').Router();
const {getAllArticles, getComments, postComment, putArticle} = require('../controllers');
router.route('/')
  .get(getAllArticles);
router.route('/:article_id')
  .put(putArticle);
router.route('/:article_id/comments')
  .get(getComments)
  .post(postComment);
module.exports = router;