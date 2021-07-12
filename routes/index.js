var express = require('express');
var router = express.Router();

import userRoutes from './users'
import notificationRoutes from './notifications'

// handle all routes 

router.use('/user',userRoutes)
router.use('/notification',notificationRoutes)

export default router;