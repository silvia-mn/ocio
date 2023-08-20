import request from 'supertest';
import chai, { expect } from 'chai';
import app from './index.js';
import httpStatus from 'http-status';

import mongoose from 'mongoose';
import userModel from './models/user.model.js';
import loginModel from './models/login.model.js';

describe('### POST /register/user', () => {
    before((done) => {
        mongoose.connect('mongodb://localhost:27017/ocio',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
        );
        userModel.collection.drop().then(()=>{
            loginModel.collection.drop().then(()=>done());
        });
    });
    it('should return the registered user successfully', (done) => {
      request(app)
        .post('/register/user')
        .send({
            user: {
                dni: "111111111",
                phone: "11111111111",
                dob: "01/11/2000",
                name: "Test",
                surname1: "Testson",
                email: "test@test.com"
            },
            login: {
                login: "test",
                password: "test"
            }
        })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.inserted).to.exist;
          expect(res.body.inserted.user.name).to.equal('Test');
          expect(res.body.inserted.login.login).to.equal('test');
          done();
        }).catch((err)=>console.log(err).res.body);
    });
    it('should fail to register a user with same e-mail', (done) => {
        request(app)
          .post('/register/user')
          .send({
              user: {
                  dni: "222222222",
                  phone: "22222222222",
                  dob: "02/22/2000",
                  name: "Test2",
                  surname1: "Testson2",
                  email: "test@test.com"
              },
              login: {
                  login: "test2",
                  password: "test"
              }
          })
          .then(res => {
            expect(res.body.error).to.exist;
            expect(res.body.error).to.equal('Existing email or dni error');
            done();
          });
      });
      it('should fail to register a user under 18', (done) => {
        request(app)
          .post('/register/user')
          .send({
              user: {
                  dni: "222222222",
                  phone: "22222222222",
                  dob: "02/22/2020",
                  name: "Test2",
                  surname1: "Testson2",
                  email: "test2@test.com"
              },
              login: {
                  login: "test2",
                  password: "test"
              }
          })
          .then(res => {
            expect(res.body.error).to.exist;
            expect(res.body.error).to.equal('Must be at least 18 years old');
            done();
          });
      });
    });