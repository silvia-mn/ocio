import mongoose from 'mongoose';
import {hash} from './passwordFunctions.js';
import {comparePassword} from './passwordFunctions.js';
import permissions from 'mongoose-permissions';
const Schema = mongoose.Schema;



let login = new Schema(
    {
        login:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId, ref: 'user',
        },
        promoter: {
            type: Schema.Types.ObjectId, ref: 'promoter',
        }
    },
    {
        collection: 'login'
    }


).plugin(permissions);

//creamos la funcion que hashea la contraseña antes de guardarlo
login.pre('save', function (next) {
    hash(this, next)});


//creamos la funcion para comparar contraseñas como parte del modelo de usuario    
login.methods.comparePassword = function(candidatePassword,cb){
    comparePassword(this, candidatePassword,cb);
};

export default mongoose.model('login', login);