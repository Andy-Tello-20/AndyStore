import { Router } from 'express'
import passport from 'passport'
import CartsController from '../../controllers/cart.controller.js'
import { authRolesMiddleware } from '../../middlewares/roleMiddleware.js'

const router = Router()






router.post('/carts',CartsController.createCart )

//! una mejor forma de mostrar el carrito de un usuario en particular
router.get('/userCart',passport.authenticate('current', { session: false }),authRolesMiddleware('user'), CartsController.userCart)


//!Nuevo metodo para borrar un producto del carrito 

router.delete('/carts/deleteProduct/:pid', passport.authenticate('current', { session: false }),authRolesMiddleware('user'), CartsController.deleteProduct)

//! Nueva forma de agregar productos 

router.post('/carts/product/:pid/:q', passport.authenticate('current', { session: false }),authRolesMiddleware('user'), CartsController.addProduct)

router.post('/carts/preOrderProduct/:pid/:q', passport.authenticate('current', { session: false }),authRolesMiddleware('user'), CartsController.addOrderProduct)





router.get('/carts/:cid', CartsController.getCartById )

//!Router de prueba para postman
router.post('/carts/:cid/products/:pid',CartsController.addProduct)





// router.post('/carts/:cid/product/:pid', passport.authenticate('current', { session: false, failureRedirect: '/login' }),authRolesMiddleware('user'), CartsController.addProduct)

router.post('/:cid/purchase', passport.authenticate('current', { session: false, failureRedirect: '/login' }), authRolesMiddleware('user'), CartsController.purchase);

// router.post('/carts/:cid/deleteProduct/:pid', passport.authenticate('current', { session: false, failureRedirect: '/login' }),authRolesMiddleware('user'), CartsController.deleteProduct)

export default router