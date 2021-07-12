import User from '../models/User'
import { body } from 'express-validator'
import { checkValidations } from '../config/checkMehods'

export default {

    // View all users
    async findAll(req, res, next) {
        try {
            let users = await User.find();
            res.status(200).send(users)
        } catch (error) {
            next(error)
        }
    },
    // Validate the data of user
    validateBody() {
        let validations = [
            body('name').not().isEmpty().withMessage("Enter your name"),
            body('email').not().isEmpty().withMessage("Enter your email")
                .custom(async (value) => {
                    if (await User.findOne({ email: value }))
                        throw new Error("Email is already existed");
                    else
                        return true;
                }),
            body('mobileNumber').not().isEmpty().withMessage("Enter your phone number")
                .matches(/^01[0-2 5]{1}[0-9]{8}$/).withMessage('Enter a Valid Mobile Number')
                .custom(async (value) => {

                    if (await User.findOne({ mobileNumber: value }))
                        throw new Error("Mobile number is already existed");
                    else
                        return true;
                }),
        ]
        return validations
    },
    // Add a new User
    async create(req, res, next) {
        try {
            let data = checkValidations(req)
            let user = await User.create(data)
            res.status(200).send(user)

        } catch (error) {
            next(error)
        }
    }

}