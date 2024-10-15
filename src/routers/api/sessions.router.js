import { Router, json } from 'express'
import passport from 'passport'
import SessionController from '../../controllers/session.controller.js'
import {  generateToken  } from '../../utils.js'
import { UserDTO } from '../../DTO/userDTO.js'
import { logger } from '../../utils.js'

const router = Router()


router.get('/check-session', passport.authenticate('current', { session: false }), (req, res) => {
  // Si el token es válido, el usuario está autenticado

  
  res.status(200).json({ isAuthenticated: true });
});

router.post('/sessions/login',SessionController.login)

router.post('/sessions/register',SessionController.register)


router.post('/sessions/recovery-password',SessionController.recoverPassword)

router.get('/sessions/current', passport.authenticate('current', { session: false }), (req, res) => {
  if (!req.user) {
    
    return res.status(401).json({ message: 'No estas autenticado.' })
  }else{

    logger.info(`req.user current es:${JSON.stringify(req.user, null,2)}`)



    let user = new UserDTO(req.user)
    res.status(200).json(user)
  }
  
})

router.get('/sessions/logout', (req, res) => {
  // Eliminar la cookie de token del cliente
  res.clearCookie('access_token')

  // Redirigir al usuario a la página de login u otra página según tu aplicación
  // res.redirect('/login')

  res.status(200).json({ message: 'Sesión cerrada con éxito' })
});


router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email'], session: false }))

//! session: false, le estás indicando a Passport que no quieres que maneje sesiones para esta estrategia específica.prefieres trabajar solo con tokens de autenticación, como JWT, en lugar de sesiones del lado del servidor

router.get('/sessions/github/callback', passport.authenticate('github', { session: false, failureRedirect: '/login' }), (req, res) => {
  
  logger.debug(`req.user github es: ${JSON.stringify(req.user,null,2)}`)
  const token = generateToken(req.user)
  res
    .cookie('github_token', token, { maxAge: 1000 * 60 * 30, httpOnly: true })
    .redirect('/profile')
})


router.get('/sessions/google',
  passport.authenticate('google', {session:false, scope:
      [ 'email', 'profile' ] }
));

router.get('/sessions/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }), 
  (req, res) => {
    console.log('req.user de google strategy es: ', req.user);
    const token = generateToken(req.user);
    res.cookie('google_token', token, { maxAge: 1000 * 60 * 30, httpOnly: true })
       .redirect('/profile');
  }
);



export default router