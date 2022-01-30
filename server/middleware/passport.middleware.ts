import { Request } from 'express';
import passport from 'passport';
import { Strategy as LocalStratagy } from 'passport-local';
import { User } from '../models/User';




const findUserById = async (id: string) => {
  return await User.findById(id);
};


passport.use(
  new LocalStratagy(
    {
      usernameField: 'username',
       // password field is by default password
      //   passReqToCallback: true, // if set, req becomes the first user, useful for additional data from the request
    },
    async (username, password, done) => {
      // check if the user exist

      const user = await User.findOne({username})
   
      
      if (user == null) {
                return done(null, false, { message: 'No user with that email' })
              }
  try {
    if (user && (await user.comparePassword(password))) done(null, user)
    else  done(null, false)
      
  } catch (error) {
    return done(error)
  }

    }
  )
);

// put the data(user id) into the session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// get the serialized data(user id) from the session and retrieve the user
passport.deserializeUser(async (req: Request, id: string, done: any) => {
  try {
    const user = await findUserById(id);

    done(null, user);
  } catch (error) {
    // something went wrong :(
    done(error);
  }
});

export default passport;
