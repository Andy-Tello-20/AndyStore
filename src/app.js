import express from 'express';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import session from 'express-session'
import passport from 'passport';
import path from 'path';
import indexRouter from './routers/views/index.router.js';
import usersRouter from './routers/api/users.router.js';
import sessionsRouter from './routers/api/sessions.router.js';
import mpRouter from './routers/api/mercadoPago.router.js'
import productRouter from './routers/api/products.router.js'
import ticketRouter from './routers/api/ticket.router.js'
import cartRouter from './routers/api/carts.router.js'
import { __dirname, logger} from './utils.js';
import { init as initPassport } from './config/passport.config.js';
import cors from 'cors'

const app = express();


const corsOptions = {
  origin: 'http://localhost:3000', // Dominio del frontend
  credentials: true, // Permite el envío de cookies
};


app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

app.use(cors(corsOptions))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');



// app.use(session({
//   secret: 'mySuperSecretStringThatNoOneKnows12345!', // Cambia esto por una clave secreta segura
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: false, // Si usas HTTPS, configura esto en true
//     httpOnly: true,
//     maxAge: 60 * 60 * 1000 // 1 hora de duración de sesión (puedes ajustar este valor)
//   }
// }));


initPassport();
app.use(passport.initialize());
// app.use(passport.session());

app.use('/', indexRouter);
app.use('/api', usersRouter, sessionsRouter,cartRouter, productRouter,ticketRouter,mpRouter);

app.use((error, req, res, next) => {
  const message = `Ah ocurrido un error desconocido 😨: ${error.message}`;

  logger.error(`ha ocurrido un error ${error}`)

  res.status(500).json({ status: 'error', message });
});

export default app;
