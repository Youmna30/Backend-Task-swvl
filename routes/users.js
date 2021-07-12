var express = require('express');
var router = express.Router();
import userControllers from '../controllers/user'

//Create a new User
router.post('/', userControllers.validateBody() ,userControllers.create );

//Get All users
router.get('/', userControllers.findAll)

module.exports = router;
