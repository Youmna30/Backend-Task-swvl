import Notification from '../models/Notification'
import { body } from 'express-validator'
import { checkValidations } from '../config/checkMehods'
import ApiError from '../config/ApiError'

export default {
    // View all notifications
    async findAll(req, res, next) {
        try {
            let notifications = await Notification.find();
            res.status(200).send(notifications)
        } catch (error) {
            next(error)
        }
    },
    // Validate the data of notification
    validateBody() {
        let validations = [
            body('notificationType').not().isEmpty().withMessage("Enter the type of the notification").isIn(['GROUP', 'SPECIFIC']).withMessage("Wrong Notification type"),
            body('user').optional().not().isEmpty().withMessage("Choose the user").isInt(),
            body('users').optional().not().isEmpty().withMessage("Choose the users").isArray(),
            body('text').not().isEmpty().withMessage("Enter the text"),
        ]
        return validations
    },
    async createPushNotification(req, res, next) {
        try {
            let data = checkValidations(req);
            if (data.notificationType == 'SPECIFIC') {
                if (!data.user) {
                    return next(new ApiError(422, "Choose the user to send notification"))
                }
                data.users = []
                data.users.push(data.user);
                data.isPush = true
                let notification = await Notification.create(data);
                sendNotification.to('room-' + data.user).emit('Notification', notification);
                res.status(201).send(notification)
            } else {
                if (!data.users) {
                    return next(new ApiError(422, "Choose the users to send them notification"))
                }
                data.isPush = true
                let notification = await Notification.create(data);
                data.users.forEach(user => {
                    sendNotification.to('room-' + user).emit('Notification', notification);
                });
                res.status(201).send(notification)
            }
        } catch (error) {
            next(error)
        }

    },
    async createSmsNotification(req, res, next) {
        try {
            let data = checkValidations(req);
            if (data.notificationType == 'SPECIFIC') {
                if (!data.user) {
                    return next(new ApiError(422, "Choose the user to send Sms"))
                }
                data.users = []
                data.users.push(data.user);
                data.isSms = true
                let notification = await Notification.create(data);
                //Here Suppose to use SMS Provider to send a real sms to the user mobile number 
                res.status(201).send(notification)
            } else {
                if (!data.users) {
                    return next(new ApiError(422, "Choose the users to send them Sms"))
                }
                data.isSms = true
                let notification = await Notification.create(data);
                //Here Suppose to use SMS Provider to send a real sms to the user mobile number 
                res.status(201).send(notification)
            }
        } catch (error) {
            next(error)
        }

    },
    async getCountNotification(id) {
        try {
            let roomName = 'room-' + id;
            let query = { users: id, isPush: true, 'read_by.userId':  { $ne: id } }
            let notifsCount = await Notification.count(query);
            sendNotification.to(roomName).emit('CountUnReadNotification', { count: notifsCount });
        } catch (err) {
            console.log(err.message);
        }
    },
}
