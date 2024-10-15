import http from 'http';
import config from './config/config.js';
import app from './app.js';
import { init as initMongoDB } from './db/mongodb.js';

import { logger } from './utils.js';


await initMongoDB();

const server = http.createServer(app);
const PORT = config.port;
const MODE= config.mode

server.listen(PORT, () => {

  logger.info(`Server running in http://localhost:${PORT} 🚀, modo de ${MODE}`)
 
});
