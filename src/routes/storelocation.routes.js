const express = require('express');
const router = express.Router();
const storeLocationController = require('../controllers/storelocation.controller');

router.get('/', storeLocationController.getAllStoreLocations);
router.get('/:id', storeLocationController.getStoreLocationById);
router.post('/', storeLocationController.createStoreLocation);
router.put('/:id', storeLocationController.updateStoreLocation);
router.delete('/:id', storeLocationController.deleteStoreLocation);

module.exports = router;
