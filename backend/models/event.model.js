import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let event = new Schema (
    {
        name:{
            type: String,
            required:true
        },
        artists:{
            type:[String]
        },
        location:{
            type: String,
            required: true
        },
        capacity:{
            type: Number,
            required: true
        },
        info:{
            type: String,
            required: true
        },
        type:{
            type: String,
            required: true
        },
        date:{
            type: Date,
            required: true
        },
        promoter:{
            type: Schema.Types.ObjectId, ref: 'promoter',
            required: true
        },
        status:{
            type: String,
            required: true
        },
        tickets:{
            type:[{
                type: {type: String},
                amount: {type: Number}
            }],
            required: true
        }

    }
);

export default mongoose.model('event', event);