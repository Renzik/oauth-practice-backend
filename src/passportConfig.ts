import User from './Models/User';
import bcrypt from 'bcryptjs';
import { IMongoDBUser } from './types';
const localStrategy = require('passport-strategy').Strategy;

module.exports = (passport: any) => {
  passport.use(
    new localStrategy((email: any, password: any, done: any) => {
      User.findOne({ email: email }, (err: Error, doc: IMongoDBUser) => {
        if (err) throw err;
        if (!doc) return done(null, false);
        bcrypt.compare(password, doc.password, (err: Error, success: any) => {
          if (err) throw err;
          if (success === true) done(null, doc);
          else {
            done(null, false);
          }
        });
      });
    })
  );
};
