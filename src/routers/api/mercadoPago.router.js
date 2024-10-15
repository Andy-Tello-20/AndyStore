import { Router } from "express";
import mpController from "../../controllers/mercadoPagoController.js";
import passport from 'passport'
import { authRolesMiddleware } from '../../middlewares/roleMiddleware.js'

const router = Router()

router.post("/create_preference", passport.authenticate('current', { session: false }), authRolesMiddleware('user'), mpController.findCart)

    
export default router

