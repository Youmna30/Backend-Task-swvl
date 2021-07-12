import mongoose, { Schema } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const notificationSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    users: {
        type: [Number],
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    read_by: [
        {
            userId: {
                type: Number,
                ref: 'User',
                required: true
            },
            readAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    isPush: {
        type: Boolean,
        default: false
    },
    isSms: {
        type: Boolean,
        default: false
    },
    notificationType: {
        type: String,
        enum: ['GROUP', 'SPECIFIC'],
        required: true
    }
}, { timestamps: true })

autoIncrement.initialize(mongoose.connection);
notificationSchema.plugin(autoIncrement.plugin, { model: 'Notification', startAt: 1 })

export default mongoose.model('Notification', notificationSchema);