import passport from "passport";
import { UserService } from "../repositories/index.js";
import GitHubStrategy from "passport-github2";
import { createHash, compareAsync } from "../utils.js"
import local from 'passport-local';
import jwt from 'passport-jwt';
import 'dotenv/config';
import { logger } from "../utils/logger.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

export const initializePassport = async () => {
    passport.use('github',
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: process.env.GITHUB_CALLBACK_URL,
                scope: ['user:email']
            },
            async (accessToken, refreshToken, profile, done) => {
                const email = profile._json.email || profile.emails[0].value;
                const user = await UserService.getUserByEmail(email);
        
                if (user) {
                    return done(null, user);
                }
        
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: email,
                    password: ''
                };
        
                await UserService.registerUser(newUser);
        
                return done(null, newUser);
            }
        )
    );

    passport.use('register', new LocalStrategy({
        passReqToCallback: true, 
        usernameField: 'email'
    }, async (req, username, password, done) => {

        const { name, email } = req.body
        try {
            const user = await UserService.getUserByEmail(username);
            if (user) {
                logger.info('User already exits');
                return done(null, false)
            }

            const newUser = {
                name,
                email,
                password: createHash(password)
            }

            const result = await UserService.registerUser(newUser);
            return done(null, result);
        } catch (error) {
            done('Error to register ' + error)
        }
    }))

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async(username, password, done) => {
            try {
                const user = await UserService.getUserByEmail(username);

                if(!user) {
                    return done(null, false, { message: 'User doesn\'t exist' });
                }

                const validPassword = await compareAsync(password, user.password)

                if(!validPassword) {
                    return done(null, false, { message: 'Password not valid' });
                }

                return done(null, user);
            } catch (error) {
                logger.error('Error passport-login: ' + error);
                return done('Error passport-login: ' + error);
            }
        }
    ))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwtPayload, done) => {
        try {
            return done(null, jwtPayload);
        }
        catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.email);
    });
    
    passport.deserializeUser(async (email, done) => {
        const user = await UserService.getUserByEmail(email);
    
        done(null, user);
    });
}

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['access_token'];
    }
    return token;
}