var express = require('express');
var router = express.Router();

// Require our controllers.
var schoolController = require('../controllers/schoolController');

router.get('/', schoolController.list);
router.post('/', schoolController.create);

module.exports = router;