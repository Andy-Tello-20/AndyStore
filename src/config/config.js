import dotenv from 'dotenv'
import { Command, Option } from 'commander'

let program = new Command()

program.addOption(new Option("-m --mode <MODE>", "Modo de ejecucion").choices(["dev", "prod"]).default("dev"))

program.parse()
const options = program.opts()
const mode = options.mode

dotenv.config(

    {
        path: mode === "prod" ? "./src/.env.prod" : "./src/.env",
        override: true

    }
)

export default {

    port: process.env.PORT,
    mongoDbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    mode: process.env.MODE,
    mpToken: process.env.ACCESSTOKENMP,
    gitHubClientId: process.env.CLIENTE_ID,
    gitHubSecret: process.env.CLIENTE_SECRET,
    googleClient: process.env.GOOGLE_CLIENT_ID,
    googleSecret: process.env.GOOGLE_CLIENT_SECRET,

    PERSISTENCE: process.env.PERSISTENCE || "FS"

}