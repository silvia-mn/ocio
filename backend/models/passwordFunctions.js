import bcrypt from 'bcrypt'
const SALT_WORK_FACTOR = 10;



//creamos la funcion que hashea la contraseña antes de guardarlo
export const hash = (user, next) => {
    //si el campo no se ha modificado, no se hace nada
    if (!user.isModified('password')) return next();

    //si se ha modificado hay que hashearla antes de guardarla
    bcrypt.genSalt(SALT_WORK_FACTOR,(err, salt) => {
        //si no se puede generar el salt, lanza un error
        if (err) return next(err);
        //en caso contrario se guarda el usuario con la contraeña hasheada
        bcrypt.hash(user.password, salt,(err, hash) =>{
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
};


//creamos la funcion para comparar contraseñas     //cb=callback
export const comparePassword = (user, candidatePassword, cb) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null,isMatch);
    });
};





