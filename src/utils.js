import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import JWT from 'jsonwebtoken';
import config from './config/config.js';
import winston from 'winston';


const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (bodyPassword, passwordDB) => bcrypt.compareSync(bodyPassword, passwordDB);

const jwt_secret = config.jwtSecret

export const generateToken = (user) => {
  const payload = {
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
    email: user.email,
    age: user.age,
    cart: user.cart
  };
  return JWT.sign(payload, jwt_secret, { expiresIn: '10m' });
};


export const errorDictionary = {
  PRODUCT_NOT_FOUND: 'Producto no encontrado.',
  PRODUCT_CREATION_ERROR: 'Error al crear un producto.',
  PRODUCT_UPDATE_ERROR: 'Error al actualizar el producto.',
  PRODUCT_DELETION_ERROR: 'Error al eliminar el producto.',
};




//!niveles personalizados

const customLevels = {
  levels: {
    debug: 5,
    http: 4,
    info: 3,
    warning: 2,
    error: 1,
    fatal: 0
  }
};

//! Crear el logger de desarrollo
const devLogger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize({
        colors:{fatal:"bold red",error: 'red', warning:"yellow", info:"green", http: "magenta",debug: 'blue'}
    }),
    winston.format.printf(({ timestamp, level, message }) => `Log level ${level}: ${message} , Fecha: ${timestamp}`)
),
  
  transports: [
    //? Nivel mínimo: debug
    new winston.transports.Console({ level: 'debug' }) 
  ]
});

//! Crear el logger de producción
const prodLogger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [
    //? Nivel mínimo: info
    new winston.transports.Console({ level: 'info' }), 

    //? Nivel mínimo: error
    new winston.transports.File({ filename: './src/logs/errors.log', level: 'error' }) 
  ]
});


 export let logger

if(config.mode!="Produccion"){
  
  logger=devLogger
}else{
  logger=prodLogger
}

