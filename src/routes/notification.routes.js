const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

router.get('/', notificationController.getAllNotifications);
router.get('/:id', notificationController.getNotificationById);
router.get('/user/:userId', notificationController.getNotificationsByUserId);
router.post('/', notificationController.createNotification);
router.put('/:id', notificationController.updateNotification);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
