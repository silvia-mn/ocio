import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let promoter = new Schema (
    {
        cif:{
            type: String,
            required: true,
            unique: true
        },
        name:{
            type: String,
            required: true
        },
        email:{
            type: String,
            unique:true,
            required: true,
            match: /.+\@.+\..+/
        },
        phone:{
            type: String,
            required: true
        },
        personInCharge:{
            type: String,
            required: true
        },
        registeredOffice:{
            type: String,
            required: true
        },
        socialCapital:{
            type: Number,
            required: true
        }, 
        validated:{
                type: Boolean,
                required: true
        }
        
    },
    {
        collection: 'promoters'
    }
);

export default mongoose.model('promoter', promoter);