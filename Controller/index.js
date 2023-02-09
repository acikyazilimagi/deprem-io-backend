const CollabrationController = require('../Controller/Collabration/CollabrationController');
const express = require('express');
const router = express.Router();

router.get('/', CollabrationController.getAll);
router.get('/:id', CollabrationController.show);
router.post('/', CollabrationController.store);
router.put('/:id', CollabrationController.update);
router.delete('/:id', CollabrationController.delete);

module.exports = router;
