import mongoose from 'mongoose';
import event from './event.model.js';
import user from './user.model.js';
const Schema = mongoose.Schema;


let transaction = new Schema (
    {
        user: {
            type: Schema.Types.ObjectId, ref: 'user',
            required: true
        },
        amount: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            required: true
        },
        event:{
            type: Schema.Types.ObjectId, ref: 'event',
            required: true
        },
        paymentId:{
            type: String,
            required: true,
        }

    }
);


export default mongoose.model('transaction', transaction);