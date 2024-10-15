import { Router } from 'express'
import passport from 'passport'
import ticketController from '../../controllers/ticket.controller.js'
import { authRolesMiddleware } from '../../middlewares/roleMiddleware.js'

const router = Router()

router.get('/ticket', passport.authenticate('current', { session: false, failureRedirect: '/login' }), authRolesMiddleware('user'), ticketController.getTicket)

export default router 