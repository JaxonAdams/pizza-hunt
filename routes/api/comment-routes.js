const router = require('express').Router();
const { addComment, removeComment } = require('../../controllers/comment-controller');

// Add comment at /api/comments/<pizzaId>
router.route('/:pizzaId').post(addComment);

// Delete comment at /api/comments/<pizzaId>/<commentId>
router.route('/:pizzaId/:commentId').delete(removeComment);

module.exports = router;