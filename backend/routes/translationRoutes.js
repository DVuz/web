const express = require('express');
const router = express.Router();
const translationController = require('../controllers/translationController');

router.get('/:lang/:namespace', translationController.getTranslation);
router.get('/:lang/namespaces', translationController.getAvailableNamespaces);

module.exports = router;
