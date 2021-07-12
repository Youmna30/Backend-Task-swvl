import mongoose, { Schema } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const userSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    }
}, { timestamps: true })

autoIncrement.initialize(mongoose.connection);
userSchema.plugin(autoIncrement.plugin, { model: 'User', startAt: 1 })

export default mongoose.model('User', userSchema);