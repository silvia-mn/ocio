import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import session from 'express-session';
import passport from 'passport';
import {strategyInit} from './lib/AuthStrategy.js'

import user from './models/user.model.js';
import event from './models/event.model.js';
import transaction from './models/transaction.model.js';
import promoter from './models/promoter.model.js';
import login from './models/login.model.js';

import { delete_promoter, register_user, show_event, delete_promoter_by_admin, all_promoters } from './functions.js';
import { register_promoter } from './functions.js';
import { register_event } from './functions.js';
import { unvalidated_promoters } from './functions.js';
import { search_events } from './functions.js';
import { validate_promoter } from './functions.js';
import { promoter_events } from './functions.js';
import { delete_event } from './functions.js';
import { modify_event } from './functions.js';
import { user_account } from './functions.js';
import { promoter_account } from './functions.js';
import { delete_user } from './functions.js';
import {pay} from './functions.js'
import { userTransactions } from './functions.js';
import { generatePdf} from './to_pdf/to_pdf.js';

import {adminRole} from './models/roles.js';

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

// Instanciamos Express y el middleware de JSON y CORS
const app = express();
app.use(express.json());
app.use(cors({credentials:true, origin: process.env.FRONTEND_URL})); 

app.use(session({
    secret: 'cines-session-cookie-key', // Secreto de la sesión (puede ser cualquier identificador unívoco de la app, esto no es público al usuario)
    name: 'SessionCookie.SID', // Nombre de la sesión
    resave: true,
    httpOnly: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 3600000000, // Expiración de la sesión
    },
}));

app.use(passport.initialize()); // passport.initialize() inicializa Passport
app.use(passport.session()); // passport.session() indica a Passport que usará sesiones
strategyInit(passport);

mongoose.connect(process.env.MONGO_URI,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

//Asignamos el rol de admin al usuario admin en caso de que no exista
const ADMIN_LOGIN = {
    login : "admin",
    password: "1234root"
};
login.findOne({login:ADMIN_LOGIN.login}).then( a => {
    if(!a){
        const newAdmin = new login(ADMIN_LOGIN);
        newAdmin.assignRole(adminRole);
    }
});

const check_permissions=(req,res,permission,done)=>{
    if(!!req.isAuthenticated()){
        const user = req.user //Objeto login
        if (user.can(permission)){
            done(user);
        }
        else res.status(401).json({error:'this user does not have permissions'});
    }
    else res.status(401).json({error:'the user is not logged in'});
}

const std_callback = (res,err,result)=>{
    if(!!err){
        var sta = 400;
        if (!!err.status) sta = err.status;
        res.status(sta).json(err);
    }else{
        res.status(200).json(result);
    }
}

/**
 * ENDPOINT: POST /register/user --> Registra un usuario
 * 
 *
 */
app.post("/register/user", (req, res) => {
    register_user(req.body,(err,result)=>{
        std_callback(res,err,result);
    });
});

/**
 * ENDPOINT: POST /register/promoter --> Registra un promotor
 * 
 *
 */
app.post("/register/promoter", (req, res) => {
    register_promoter(req.body,(err,result)=>{
        std_callback(res,err,result);
    });
});


app.post('/login', passport.authenticate('local'), (req, res) => {
    if (!!req.user) res.status(200).json({status:'OK'});
    else res.status(500).json({status: "Sesión no iniciada"});
});

app.get('/login', (req,res)=>{
    if(req.isAuthenticated()){
        res.status(200).json(req.user);
    }else{
        res.status(401).json({error:'Not authenticated', status: 401});
    }
})

/**
 * ENDPOINT: GET /events --> Muestra todos los eventos desde la fecha actual
 * 
 *
 */
app.get('/events',(req,res) => {
    var today = new Date();
    event.find({date: {$gte: today}, status: 'active'},{__v:0}).sort({date: 1}).then(resultado => {res.status(200).json(resultado)}); 
});



/**
 * ENDPOINT: GET /events/search --> Busca eventos aplicando filtro
 * 
 * INPUT: El body tiene que incluir únicamente un campo 'search' que sea una cadena ya que no sabemos si nos está filtrando por artista, por nombre de festival, tipo de festival,...
 * 
 */
app.post('/events/search', (req, res) => {
    search_events(req.body.search,(err,result)=>{
        std_callback(res,err,result);
    });
});


/**
 * ENDPOINT: GET /events/:id --> Te muestra los datos de un evento concreto
 * 
 * INPUT: El body tiene que incluir únicamente el id del evento
 * 
 */
app.get('/events/:id', (req, res) => {
    show_event(req.params.id,(err,result)=>{
        std_callback(res,err,result);
    });
});



/**
 * ENDPOINT: GET /promoters --> Muestra todas las promotoras pendientes de validar
 * 
 */
app.get('/promoters',(req, res) => {
    check_permissions(req,res,'consult-unvalidated-promoters',()=>{
        unvalidated_promoters((err,result)=>{
            std_callback(res,err,result)
        });
    });
});

app.get('/promoters/all',(req, res) => {
    check_permissions(req,res,'consult-unvalidated-promoters',()=>{
        all_promoters((err,result)=>{
            std_callback(res,err,result)
        });
    });
});

/**
 * ENDPOINT: GET /promoters/validate --> Permite validar una promotora de las que aparecen sin validar
 * 
 * INPUT: El body incluye la Id (req.body.id) de la promotora que se quiere validar de las que aparecen en /promoters (las no validadas)
 */
app.post('/promoters/validate', (req, res) => {
    check_permissions(req,res,'validate-promoters',()=>{
        validate_promoter(req.body.id,(err,result)=>{
            std_callback(res,err,result);
        });
    });
});

app.post('/promoters/delete', (req,res)=>{
    check_permissions(req,res,'delete-promoters',()=>{
        delete_promoter_by_admin(req.body.id,(err,result)=>{
            std_callback(res,err,result);
        });
    });
})

/**
 * ENDPOINT: GET /promoters/events--> Permite a una promotora ver los eventos que están actualmente disponibles
 * 
 */
app.get('/promoter/events', (req, res) =>{
    check_permissions(req,res,'manage-event', p => {
        promoter_events(p,(err,result) => {
            std_callback(res,err,result);
        });
    });
});



/**
 * ENDPOINT: POST /promoters/events/add --> Registra un nuevo evento
 * 
 * INPUT: El body tiene que incluir únicamente un campo 'event' con los datos del evento, sin la promotora que se
 *        asigna según el login.
 */
app.post('/promoter/events/add',(req,res)=>{
    check_permissions(req,res,'add-event',u=>{
        register_event(req.body,u.promoter,(err,result)=>{
            std_callback(res,err,result)
        });
    });
});


/**
 * ENDPOINT: POST /promoters/events/delete--> Permite a una promotora eliminar un evento de los que se encuentran actualmente disponibles
 * 
 * INPUT: El body debe tener el id del evento. Se selecciona el evento que se quiere borrar desde el area de usuario de la promotora
 * y se elige de la página que te muestra los eventos que estan en estado 'active'
 */

app.post('/promoter/events/delete',(req,res)=>{
    check_permissions(req, res, 'delete-event',u=>{
        delete_event(req.body.id, u.promoter, (err, result)=>{
            std_callback(res,err,result)
        });
    });
});

/**
 * ENDPOINT: POST /promoters/events/modify--> Permite a una promotora modificar los datos de un evento de los que se encuentran actualmente disponibles
 * 
 * INPUT: El body debe ser el evento y tener vacios los que no quiere modificar (el status no se puede modificar)
 */

app.post('/promoter/events/modify', (req,res)=>{
    check_permissions(req, res, 'modify-event',u=>{
        modify_event(req.body, u.promoter, (err, result)=>{
            std_callback(res,err,result)
        });
    });
});

/**
 * ENDPOINT: POST /user/account--> Permite a un usuario modificar los datos de su cuenta
 * 
 * INPUT: El body debe ser el usuario (sólo se puede cambiar nombre, apellidos y phone)
 */

app.post('/user/account', (req,res)=>{
    if(!!req.isAuthenticated()){
        const login = req.user //Objeto login
        console.log(login.user)
        login.populate('user').then((login)=>
        {
            user_account(login.user,req.body.user,(err,result)=> std_callback(res,err,result))
        }
        ).catch(err => console.log(err));
            
    }
    else res.status(401).json({error:'the user is not logged in'});
});


app.get('/user/transactions',(req,res)=>{
    if(!!req.isAuthenticated()){
        const login = req.user //Objeto login
        if(!!login.user){
            userTransactions(login.user,(err,result)=>std_callback(res,err,result));
        }
        else res.status(401).json({error:'this user does not have permissions'});
    }
    else res.status(401).json({error:'the user is not logged in'});
});

/**
 * ENDPOINT: GET /user-> Permite mostrar los datos de un usuario
 * 
 * INPUT: No hay, se coge de la sesión de usuario
 */

app.get('/user', (req,res)=>{
    if(!!req.isAuthenticated()){
        const login = req.user //Objeto login
        login.populate('user').then((login)=>
        {   if(!!login.user){
                std_callback(res,null,login.user) 
            }
            else{
                res.status(401).json({error:'this account is a promoter account'});
            }
        }
        ).catch(err => console.log(err));
            
    }
    else res.status(401).json({error:'the user is not logged in'});
});


/**
 * ENDPOINT: GET /promoter-> Permite mostrar los datos de un promotor
 * 
 * INPUT: No hay, se coge de la sesión de usuario
 */

app.get('/promoter', (req,res)=>{
    if(!!req.isAuthenticated()){
        const login = req.user //Objeto login
        login.populate('promoter').then((login)=>
        {   if(!!login.promoter){
                std_callback(res,null,login.promoter)
            }
            else{
                res.status(401).json({error:'the user is not a promoter'}); 
            }
        }
        ).catch(err => console.log(err));
            
    }
    else res.status(401).json({error:'the user is not logged in'});
});


/**
 * ENDPOINT: POST /promoter/account--> Permite a un promotor modificar los datos de su cuenta
 * 
 * INPUT: El body debe ser el promotor (sólo se puede cambiar name, person in charge, registered office, social capital y phone)
 */

app.post('/promoter/account', (req,res)=>{
    if(!!req.isAuthenticated()){
        const login = req.user //Objeto login
        console.log(login.promoter)
        login.populate('promoter').then((login)=>
        {
            promoter_account(login.promoter,req.body.promoter,(err,result)=> std_callback(res,err,result))
        }
        ).catch(err => console.log(err));
            
    }
    else res.status(401).json({error:'the user is not logged in'});
});

/**
 * ENDPOINT: POST /pay--> Pasarela de pago
 * 
 * INPUT: El body debe tener el id del evento (eventId), tipo de la entrada (ticketType), número de tarjeta(numCard), número de entradas que quiere comprar (numTic), cvv y fecha de expiración (expDate)
 * encriptados usando AES en una sola string, que luego hay que parsear
 */
app.post('/pay',(req,res)=>{
    if(!!req.isAuthenticated()){
        const login = req.user //Objeto login
          if(!!login.user){
               pay(login.user, req.body.encr, (err,result)=>std_callback(res,err,result)); 
            }
            else{
                res.status(401).json({error:'this account is a promoter account'});
            }
              
    }
    else res.status(401).json({error:'the user is not logged in'});
});

 /* ENDPOINT: GET /logout--> Permite a los usuarios salir de la cuenta
 * 
 */
app.get('/logout',(req,res)=>{
    req.logout(err => std_callback(res,err,{message:'OK'}));
});


/*
* ENDPOINT: GET /user/delete
*/
app.get('/user/delete',(req,res)=>{
    if(!!req.isAuthenticated()){
        const login = req.user //Objeto login
          if(!!login.user){
               delete_user(login,(err,result)=>std_callback(res,err,result)); 
            }
            else{
                res.status(401).json({error:'this account is not a user account'});
            }  
    }
    else res.status(401).json({error:'the user is not logged in'});
});

/*
* ENDPOINT: GET /user/delete
*/
app.get('/promoter/delete',(req,res)=>{
    if(!!req.isAuthenticated()){
        const login = req.user //Objeto login
          if(!!login.promoter){
                delete_promoter(login,(err,result)=>std_callback(res,err,result)); 
            }
            else{
                res.status(401).json({error:'this account is not a promoter account'});
            }  
    }
    else res.status(401).json({error:'the user is not logged in'});
});

app.post('/pdf', (req,res)=>{
   generatePdf(req.body.paymentId,
        req.body.eventName,
        req.body.ticketType,
        req.body.totalAmount,
        req.body.numTics).then((result)=>{
    res.send(result);}).catch(err=>console.log(err));
});

// Definimos el puerto 3000 como puerto de escucha y un mensaje de confirmación cuando el servidor esté levantado
app.listen(process.env.PORT,() => {
    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
});

export default app;