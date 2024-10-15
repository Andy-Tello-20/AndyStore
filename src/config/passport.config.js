import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GithubStrategy } from 'passport-github2'
import { Strategy as GoogleStrategy } from 'passport-google-oauth2'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import UserModel from '../dao/models/user.model.js'
import config from './config.js'
import {logger} from '../utils.js'

const jwt_secret = config.jwtSecret
const clienteID= config.gitHubClientId
const clienteSecret = config.gitHubSecret

const googleClient= config.gitHubClientId
const googleSecret= config.googleSecret

export const init = () => {
  const registerOpts = {
    usernameField: 'email',
    passReqToCallback: true,
  }

  const githubOpts = {
    clientID: clienteID,
    clientSecret: clienteSecret,
    callbackURL: 'http://localhost:8080/api/sessions/github/callback',
  }


  passport.use('github', new GithubStrategy(githubOpts, async (accesstoken, refreshToken, profile, done) => {

    const email = profile._json.email

    logger.debug(`email es: ,${email}`)
  

    let user = await UserModel.findOne({ email })
    console.log('user encontrado de la base: ', user)
    if (user) {
      return done(null, user)
    }
    user = {
      first_name: profile._json.name,
      last_name: '',
      email, 
      password: '',
      provider: 'github',
      providerId: profile.id,
      age: 18,
    };
    const newUser = await UserModel.create(user)
    done(null, newUser)
  }));


//passport strategy 

const googleOpts = 
  {
    clientID:     googleClient,
    clientSecret: googleSecret,
    callbackURL: "http://localhost:8080/api/sessions/google/callback",
    passReqToCallback   : true
  }


  passport.use('google', new GoogleStrategy(googleOpts, async (request, accessToken, refreshToken, profile, done) => {
    try {
      const email = profile._json.email;
      let user = await UserModel.findOne({ email });
  
      console.log('Google Profile JSON:', profile._json);
  

      if (user) {
        return done(null, user)
      }
      // if (!user) {
      //   user = {
      //     first_name: profile._json.given_name,
      //     last_name: profile._json.family_name,
      //     email,
      //     password: '',
      //     provider: 'google',
      //     providerId: profile.id,
      //     age: 18,
      //   };
      //   const newUser = await UserModel.create(user);
      //   return done(null, newUser);
      // }
  
      console.log('Existencia del user: ', user);
      return done(null, user);
    } catch (error) {
      console.error('Error en la autenticación con Google:', error);
      return done(error);
    }
  }));
  





  const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
      token = req.cookies['access_token']
    }
 
    return token
  }

  passport.use('current', new JwtStrategy({
    secretOrKey: jwt_secret,
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  }, (payload, done) => {
    logger.debug(`payload es: ,${JSON.stringify(payload,null,2)}`)
    
    done(null, payload) // Passport asignará payload a req.user automáticamente
  }))
} 






passport.serializeUser((user, done) => {

  console.log('serializerUser: ',user)
  done(null, user._id )
})

passport.deserializeUser(async (uid, done) => {
  const user = await UserModel.findById(uid)
  done(null, user)
})



