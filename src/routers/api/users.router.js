import { Router } from 'express';
import passport from 'passport';

import UserController from '../../controllers/user.controller.js';

const router = Router();

router.get('/users',UserController.getUser );

//!Nueva forma de obtener el  perfil de usuario 
router.get('/userProfile',passport.authenticate('current', { session: false }), UserController.getUserById);


router.post('/users/', UserController.createNewUser);

router.put('/users/:uid',UserController.updateUser);

router.delete('/users/:uid',UserController.deleteUser);



export default router;