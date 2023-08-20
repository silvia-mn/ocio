import mongoose from 'mongoose';
import user from '../models/user.model.js';
import event from '../models/event.model.js';
import transaction from '../models/transaction.model.js';
import promoter from '../models/promoter.model.js';
import login from '../models/login.model.js';

import { register_event, register_user } from '../functions.js';
import { register_promoter } from '../functions.js';

import fs from 'fs';
import _ from 'underscore'

var rawdata = fs.readFileSync('./test_data/user_data.json');
let users = JSON.parse(rawdata);

mongoose.connect('mongodb://localhost:27017/ocio',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

//Keep list of promoter ids to use when registering events
const promoter_ids= [];

user.collection.drop().then(()=>{
    console.log('Collection dropped to insert test data (user)');
    login.collection.drop().then(()=>{
        console.log('Collection dropped to insert test data (login)');
        users.forEach(userData => {
            register_user(userData,(err,result)=>{
                if(!!err){
                    console.log(err);
                }else{
                    //console.log(result);
                }
            });
        });
        promoter.collection.drop().then(()=>{
            console.log('Collection dropped to insert test data (promoter)');
            rawdata = fs.readFileSync('./test_data/promoter_data.json');
            const promoters = JSON.parse(rawdata);
        
            rawdata = fs.readFileSync('./test_data/event_data.json');
            const events = JSON.parse(rawdata);
            rawdata = fs.readFileSync('./test_data/artist_data.json');
            const artists = JSON.parse(rawdata);
            const tickets = [{type:'rich', amount:1000000},{type:'poor', amount:10},{type:'premium', amount:100},{type:'vip', amount:1000},{type:'free', amount:0},{type:'really rich', amount:2000000}]
            const types = ["festival","concert","party","theater","performance"];
            const statuss = ["active","deleted"];

            event.collection.drop().then(()=>{
                console.log('Collection dropped to insert (test data (event)');

                //Register promoter logic
                promoters.forEach((promoterData) => {
                    register_promoter(promoterData,(err,result)=>{
                        if(!!err){
                            console.log(err);
                        }else{
                            //console.log(result);
                            //Añadir 3 eventos para cada promotor
                            const prom_id=result.inserted.promoter._id;
                            const es=_.sample(events,3);
                            es.forEach(e=>{
                                e.tickets = _.sample(tickets,2);
                                e.type = _.sample(types);
                                e.artists = _.sample(artists,3).map((e)=>e.artist);
                                e.status = _.sample(statuss);

                                register_event({event:e},prom_id,(err,result)=>{
                                    if(!!err){
                                        console.log(err);
                                    }else{
                                        console.log(result);
                                    }
                                });
                            });
                        }
                    });
                });
            }).catch(err=>{console.log(err);});
        }).catch(err=>{console.log(err);});
    }).catch((err)=>{console.log(err);});
}).catch((err)=>{console.log(err);});