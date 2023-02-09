const CollabrationController = require('../Controller/Collabration/CollabrationController');
const express = require('express');
const router = express.Router();

router.get('/', CollabrationController.getAll);
router.get('/:id(\\d+)', CollabrationController.show);
router.post('/', CollabrationController.store);
router.put('/:id(\\d+)', CollabrationController.update);
router.delete('/:id(\\d+)', CollabrationController.delete);

module.exports = router;
