const router = require('express').Router();
const {putComment, deleteComment} = require('../controllers');
router.route('/:comment_id')
  .put(putComment)
  .delete(deleteComment);
module.exports = router;