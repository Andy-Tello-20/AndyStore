import { Router } from "express";
import mpController from "../../controllers/mercadoPagoController.js";
import passport from 'passport'
import { authRolesMiddleware } from '../../middlewares/roleMiddleware.js'

const router = Router()

router.post("/create_preference", passport.authenticate('current', { session: false }), authRolesMiddleware('user'), mpController.findCart)

    
export default router


   

    // let preference = {
    // 	items: [
    // 		{
    // 			title: req.body.description,
    // 			unit_price: Number(req.body.price),
    // 			quantity: Number(req.body.quantity),
    // 		}
    // 	],
    // 	back_urls: {
    // 		"success": "http://localhost:8080/feedback",
    // 		"failure": "http://localhost:8080/feedback",
    // 		"pending": "http://localhost:8080/feedback"
    // 	},
    // 	auto_return: "approved",
    // };

    // mercadopago.preferences.create(preference)
    // 	.then(function (response) {
    // 		res.json({
    // 			id: response.body.id
    // 		});
    // 	}).catch(function (error) {
    // 		console.log(error);
    // 	});
;