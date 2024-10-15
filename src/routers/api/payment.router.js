import { Router } from 'express'
import passport from 'passport'
import { authRolesMiddleware } from '../../middlewares/roleMiddleware.js'
import paymentController from '../../controllers/payment.controler.js'

const router = Router()




router.get('/payment-success',passport.authenticate('current', { session: false, failureRedirect: '/login' }), authRolesMiddleware('user'), paymentController.paySuccess )

router.get('payment-rejected', paymentController.payRejected)

router.get('payment-pending', paymentController.payPending)


export default router