import { Router } from 'express'
import passport from 'passport'
import HomeController from '../../controllers/home.controller.js'
const router = Router()

router.get('/profile', passport.authenticate('current', {session:false, failureRedirect: '/login' }), HomeController.getIndex)

router.get('/login', (req, res) => {
  res.status(200).render('login', { title: 'login' })
})

router.get('/register', (req, res) => {
  res.status(200).render('register', { title: 'register' })
})

router.get('/recovery-password', (req, res) => {
  res.status(200).render('recovery-password', { title: 'recovery-password' })
})

router.get('/createCart', (req,res) =>{
res.status(200).render('createCart', { title: 'crear carrito' })
})


router.get('/userCart', passport.authenticate('current', { session: false, failureRedirect: '/login' }), HomeController.userCart )

export default router
