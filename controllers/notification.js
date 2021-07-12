import Notification from '../models/Notification'
import User from '../models/User'
import { body } from 'express-validator'
import { checkValidations } from '../config/checkMehods'
import ApiError from '../config/ApiError'


// send notification 
async function sendNotificationApi(data, pushNotification, res) {
    
    data.isPush = pushNotification;
    data.isSms = !pushNotification;
    //This to handle number of requests per minute
    if(!pushNotification){
        if(requestCount == process.env.NUMBER_OF_REQUESTS){
            throw new ApiError(400,"You have exceeded your number of requests")
        }
    }
    let notification;
    if (data.notificationType == 'SPECIFIC') {
        if (!data.user) {
            throw new ApiError(422, "Choose the user to send notification")
        }
        data.users = []
        data.users.push(data.user);
        notification = await Notification.create(data);
        if (data.isPush) {

            sendNotification.to('room-' + data.user).emit('Notification', notification);
        }
        else{
            requestCount++
        }
    } else {
        if (!data.users) {
            throw new ApiError(422, "Choose the users to send them notification")
        }
        notification = await Notification.create(data);
        if (data.isPush) {
            data.users.forEach(user => {
                sendNotification.to('room-' + user).emit('Notification', notification);
            });
        }
        else{
            requestCount++
        }
    }
    res.status(201).send(notification)
}


export default {
    // View all notifications
    async findAll(req, res, next) {
        try {
            let {isPush, user} = req.query
            let query = {}
            if(isPush == 'TRUE'){
                query.isPush = true
            }
            if(user){
                query.users = user
            }
            let notifications = await Notification.find(query);
            res.status(200).send(notifications)
        } catch (error) {
            next(error)
        }
    },
    // Validate the data of notification
    validateBody() {
        let validations = [
            body('notificationType').not().isEmpty().withMessage("Enter the type of the notification").isIn(['GROUP', 'SPECIFIC']).withMessage("Wrong Notification type"),
            body('user').optional().not().isEmpty().withMessage("Choose the user").isInt().withMessage("Enter a user Id digit")
                .custom(async (value) => {
                    if (!await User.findOne({ _id: value })) {
                        throw new Error("User isn't found");
                    }
                    else {
                        return true;
                    }
                }),
            body('users').optional().not().isEmpty().withMessage("Choose the users").isArray().withMessage("Enter an array of Users Ids")
                .custom(async (value) => {
                    let users = await User.find({ _id: {$in:value} })
                        if (users.length != value.length) {
                            throw new Error( "User isn't found");
                        }
                        else {
                            return true;
                        }

                }),
            body('text').not().isEmpty().withMessage("Enter the text"),
        ]
        return validations
    },

    async createPushNotification(req, res, next) {
        try {
            let data = checkValidations(req);
            await sendNotificationApi(data, true, res);
        } catch (error) {
            next(error)
        }

    },
    async createSmsNotification(req, res, next) {
        try {
            let data = checkValidations(req);
            await sendNotificationApi(data, false, res);
        } catch (error) {
            next(error)
        }

    },
    async getCountNotification(id) {
        try {
            let roomName = 'room-' + id;
            let query = { users: id, isPush: true, 'read_by.userId': { $ne: id } }
            let notifsCount = await Notification.count(query);
            sendNotification.to(roomName).emit('CountUnReadNotification', { count: notifsCount });
        } catch (err) {
            console.log(err.message);
        }
    },
}
