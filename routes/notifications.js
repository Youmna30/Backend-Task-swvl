var express = require('express');
var router = express.Router();
import notificationControllers from '../controllers/notification'


//Get All notifications
router.get('/', notificationControllers.findAll)

//Create a new push notification
router.post('/push', notificationControllers.validateBody() ,notificationControllers.createPushNotification );

//Create a new sms notification
router.post('/sms', notificationControllers.validateBody() ,notificationControllers.createSmsNotification );


module.exports = router;
