import user from './models/user.model.js'
import login from './models/login.model.js'
import promoter from './models/promoter.model.js'
import transaction from './models/transaction.model.js'
import event from './models/event.model.js'
import axios from 'axios';
import CryptoES from 'crypto-es';
import {promoterRole} from './models/roles.js';
import { ObjectId } from 'mongodb';

export const register_user = (body,done) => {
    const newUser = new user(body.user);
    const newLogin = new login(body.login);
    newLogin.user = newUser;
    // validate >18yo
    const dob  = new Date(newUser.dob);
    const diff = new Date(Date.now() - dob.getTime())
    const age = Math.abs(diff.getFullYear() - 1970);
    if (age < 18)
        done({error:'Must be at least 18 years old',status:400});
    else{
        user.findOne({$or: [{email : newUser.email},{dni:newUser.dni}]}).then(u => {
            if(!!u) done({error:'Existing email or dni error',status:400});
            else{
                login.findOne({login : newLogin.login}).then(l => {
                    if(!!l) done({error:'Existing login error',status:400});
                    else{
                        newUser.save().then(()=>{
                            newLogin.save().then(()=>{
                                done(null, {inserted:{
                                    'user' : newUser,
                                    'login' : newLogin,}
                                });});
                            }).catch( err => {
                                console.log(err);
                                //revert user save
                                user.findByIdAndDelete(newUser).then(()=>{
                                    done({error:'Incorrect login format error',status:400});
                                }).catch(err => {console.log(err)});
                            }).catch( err => {
                            console.log(err);
                            done({error:'Incorrect user format error',status:400});
                        });
                    }
                });
            }
        });
    }
}

export const register_promoter = (body,done) => {
    const newPromoter = new promoter(body.promoter);
    const newLogin = new login(body.login);
    newLogin.promoter = newPromoter;
    newPromoter.validated = false;
    
    promoter.findOne({$or: [{email : newPromoter.email},{cif:newPromoter.dni}]}).then(p => {
        if(!!p) done({error:'Existing email or cif error',status:400});
        else{
            login.findOne({login : newLogin.login}).then(l => {
                if(!!l) done({error:'Existing login error',status:400});
                else{
                    newPromoter.save().then(()=>{
                        newLogin.save().then(()=>{
                            done(null,{inserted:{
                                'promoter' : newPromoter,
                                'login' : newLogin,
                            }});
                        }).catch( err => {
                            console.log(err);
                            //revert user save
                            user.findByIdAndDelete(newPromoter).then(()=>{
                                done({error:'Incorrect login format error',status:400});
                            }).catch(err => {console.log(err)});
                        });
                    }).catch( err => {
                        console.log(err);
                        done({error:'Incorrect promoter format error',status:400});
                    });
                }
            });
        }
    });
}

export const register_event = (body,promoter,done)=>{
    const ev = new event({...body.event,status:"active"});
    ev.promoter = promoter;
    ev.status = 'active';
    ev.save().then(()=>{
        done(null,{inserted:ev});
    }).catch(err => {
        console.log(err);
        done({error:'invalid event format',status:400})
    });
}

function gt24h(date) {
    const diff = Math.abs(date.getTime() - Date.now())/(1000*3600); //ms to hours
    return (diff > 24);
}

export const delete_event=(id, promoter, done)=>{
    event.findById(id).then((ev)=>{
        if (gt24h(ev.date)){
            if(promoter.equals(ev.promoter)){
                ev.status='delete';
                ev.save().then(()=>{
                    done(null,{modified:ev});
                }).catch(err => {
                    console.log(err);
                    done({error: 'Error deleting event', status:500});
                });
            }
            else{
                done({error:'this user does not have permissions', status:401});
            }
        }else done({error:"Less than 24 hours to the event",status:401});
    }).catch(err=>{
        done({error:'event not found', status:404});
    });    
}


export const modify_event=(e, promoter, done)=>{
    event.findById(e._id).then((ev)=>{
        if (gt24h(ev.date) || (!!e.date && gt24h(new Date(e.date)))){
            if(promoter.equals(ev.promoter)){
                if(!!e.name) ev.name= e.name;
                if(!!e.artists) ev.artists= e.artists;  
                if(!!e.location) ev.location= e.location; 
                if(!!e.capacity) ev.capacity= e.capacity;
                if(!!e.info) ev.info= e.info;  
                if(!!e.type) ev.type= e.type; 
                if(!!e.date) ev.date= e.date; 
                if(!!e.tickets) ev.tickets= e.tickets; 
                ev.save().then(()=>{
                    done(null,{modified:ev});            
                }).catch(err => {
                    console.log(err);
                });
            }    
            else{
                done({error:'this user does not have permissions', status:401});
            }
        }else done({error:"Less than 24 hours to the event",status:401});
    }).catch(err=>{
        done({error:'event not found', status:404});
    });     
}

export const unvalidated_promoters = (done)=>{
    promoter.find({validated: false}).then(result => done(null,result)).catch((err)=>console.log(err));
}

export const all_promoters = (done)=>{
    promoter.find().then(result => done(null,result)).catch((err)=>console.log(err));
}

export const search_events = (search,done) => {
    var today = new Date();
    const query = event.find({date: {$gte: today}}, {__v: 0}).sort({date: 1});
    if (!!search){
        //Filtramos!
        query.find({$or: [ { type: { '$regex' : search, '$options': 'i'}  }, { name: { '$regex' : search, '$options': 'i'} }, {artists: { '$regex' : search, '$options': 'i'} } ]})
        .then(result => {
            result.length ==0 ? done({error: "No results found",status:404}) : done(null,result);
        }).catch((err)=>console.log(err)); 
    }else{
        done({error:"Invalid search string",status: 400});
    }
}

export const show_event =(id, done)=>{
    event.findById(id).then(event=>{
        done(null,event);
    }).catch(err=>{done({error: "This event does not exist", status:404})});
}


export const validate_promoter = (id,done) => {
    promoter.findById(id).then(promoter => {
        promoter.validated = true;
        //Buscar el login asociado a traves del campo promoter del login
        login.find({promoter : new ObjectId(id)}).then(ll => {
            const l = ll[0];
            //Asignar rol al login
            l.assignRole(promoterRole);
            promoter.save().then(()=>{
                done(null,{result:'The promoter has been validated correctly'})
            }).catch(err => {
                console.log(err);done({error:'Promoter is not validated: Cannot save promoter',status:500})});
        }).catch(err => {
            console.log(err);
            done({error:'Associated login not found error',status:500});
        });
    }).catch(err=>done({error:'Promoter not found', status:404}));
}

export const promoter_events = (p,done) => {
    event.find({status: "active", promoter: new ObjectId(p.promoter)}).then(result => {done(null,result)})
    .catch(err => console.log(err));

}

export const user_account=(user, new_user_data, done)=>{
    if(!!new_user_data){
        if(!!new_user_data.name) user.name= new_user_data.name;
        if(!!new_user_data.surname1) user.surname1= new_user_data.surname1;
        if(!!new_user_data.surname2) user.surname2= new_user_data.surname2;
        if(!!new_user_data.phone) user.phone= new_user_data.phone;
        user.save().then(()=>{
            done(null,{modified:user});            
        }).catch(err => {
            console.log(err);
            });
    }
    else{
        done({error: 'Invalid data', status:400});
    }
}

export const promoter_account=(promoter, new_promoter_data, done)=>{
    if(!!new_promoter_data){
        if(!!new_promoter_data.name) promoter.name= new_promoter_data.name;
        if(!!new_promoter_data.personInCharge) promoter.personInCharge= new_promoter_data.personInCharge;
        if(!!new_promoter_data.registeredOffice) promoter.registeredOffice= new_promoter_data.registeredOffice;
        if(!!new_promoter_data.phone) promoter.phone= new_promoter_data.phone;
        if(!!new_promoter_data.socialCapital) promoter.socialCapital= new_promoter_data.socialCapital;
        promoter.save().then(()=>{
            done(null,{modified:promoter});            
        }).catch(err => {
            console.log(err);
            });
    }
    else{
        done({error: 'Invalid data', status:400});
    }
}

export const pay =(userId, encr, done)=>{
    try{
    const datastr = CryptoES.AES.decrypt(encr,"verysecret").toString(CryptoES.enc.Utf8);
    const data = JSON.parse(datastr);
    const eventId=data.eventId;
    const TicketType=data.ticketType;
    const numCard=data.numCard;
    const numTic=data.numTic;
    const cvv=data.cvv;
    const expDate=data.expDate;

    event.findById(new ObjectId(eventId)).then(event=>{
        if (event.capacity < numTic)
            done({error:'There are not sufficient tickets'});
        else{
            const ticket = event.tickets.find(ticket => (
                (ticket.type == TicketType)
            ));
            const eventPrice=ticket.amount;
            
            const totalAmount= (eventPrice * numTic).toString();
            const clientId= '12';
            const data= {
                'clientId': clientId,
                'paymentDetails':{
                    'creditCard':{
                        'cardNumber': numCard,
                        'cvv': cvv,
                        'expiresOn': expDate
                    },
                'totalAmount': totalAmount
                }
            };
            console.log(data);
            
            axios.post('https://pse-payments-api.ecodium.dev/payment', data)
                .then(response => {
                if(!!response.data.success){
                    const trans= {
                        user: userId,
                        amount: totalAmount,
                        date: new Date(),
                        event: eventId,
                        paymentId: response.data._id
                    }
                    const transactionObj = new transaction(trans);
                    transactionObj.save().then(res=>{
                        event.capacity = event.capacity - numTic;
                        event.save().then(()=>{
                            done(null,res);
                            console.log(res);
                        }
                        ).catch(er=>{
                            console.log(er);
                            done({status:500, error: 'Event was not saved'});
                        });

                    }).catch(er=>{
                        console.log(er);
                        done({status:500, error: 'Transaction was not saved'});
                    });
                }
                else{
                    done({status:400, error: 'Transaction failed'})
                }
                })
                .catch(error => {
                if (!!error.response){
                    console.log(error.response.data);  
                    done({errors:error.response.data.errors, status:400});
                }else{
                    console.log(error);
                    done({error: 'unknown', status:500});
                }
                });
        }
    }).catch((err)=>{console.log(err);done({error:'Cannot find requested event', status:400})});

    }catch (err) {
        done({error:'invalid encryption data',status:400});
    }
}

export const userTransactions=(userId,done)=>{
    transaction.find({user: new ObjectId(userId)}).populate('event').then( (ts)=>{  
            done(null,ts);
    }).catch((err)=>{
        console.log(err);
        done({error:"Unknown error",status:500});
    });
}

export const delete_user=(l,done)=>{
    login.findByIdAndDelete(l._id).then(()=>{
        user.findByIdAndDelete(l.user).then(()=>{
            done(null,{deleted:'ok'});
        }).catch(()=>done({error:'Error deleting user data',status:500}));
    }).catch(()=>done({error:'Error deleting login data',status:500}));
}

export const delete_promoter=(l,done)=>{
    login.findByIdAndDelete(l._id).then(()=>{
        promoter.findByIdAndDelete(l.promoter).then(()=>{
            done(null,{deleted:'ok'});
        }).catch(()=>done({error:'Error deleting promoter data',status:500}));
    }).catch(()=>done({error:'Error deleting login data',status:500}));
}

export const delete_promoter_by_admin=(pId,done)=>{
    login.findOneAndDelete({promoter : new ObjectId(pId)}).then(()=>{
        promoter.findByIdAndDelete(pId).then(()=>{
            done(null,{deleted:'ok'});
        }).catch((err)=>{
            done({error:'Error deleting promoter data',status:500});
            console.log(err);
            });
    }).catch((err)=>{
        done({error:'Error deleting login data',status:500});
        console.log(err);
        });
}