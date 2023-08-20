import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let user = new Schema(
    {
        dni:{
            type: String,
            required: true,
            unique: true
        },
        name:{
            type: String,
            required: true
        },
        surname1:{
            type: String,
            required: true
        },
        surname2:{
            type: String
        },
        dob:{ //acordarse de validar que es mayor de edad
            type: Date,
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
    },
    {
        collection: 'users'
    }


);

export default mongoose.model('user', user);