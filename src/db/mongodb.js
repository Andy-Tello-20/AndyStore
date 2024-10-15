

import mongoose from "mongoose"
import config from "../config/config.js"
import { logger } from "../utils.js"

const URI = config.mongoDbUri

export const init =async () => {
    try {
        await mongoose.connect(URI)
        logger.info('Database connected successfuly')

    } catch (error) {
        logger.error(`Ha ocurrido un error al intentar conectarse:, ${error.message}`)
 
    }
}