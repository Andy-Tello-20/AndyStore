import SessionMongoDAO from "../dao/sessionMongoDAO.js"
import { createHash, generateToken, isValidPassword, logger } from '../utils.js'
import { cartService } from "../services/CartServices.js"

export default class SessionController {

  static login = async (req, res) => {

    const { email, password } = req.body



    const user = await SessionMongoDAO.getUser(email)



    logger.info(`user desde la DB es:, ${user}`)



    //validacion de que exista el user (email)
    if (!user) {

      // return res.status(404).render('error', { title: 'Hello People 🖐️', messageError: 'Usuario no registrado.' })
      return res.status(404).json({ messageError: 'Usuario no registrado.'  })
    }


    //por medio del modelo/esquema de SessionMongoDAO. estamos verificando que la contraseña ingresada en el Post session/login sea igual a la que existe en la base de datos cuando nos registramos (session/register)
    if (!isValidPassword(password, user.password)) {

      return res.status(401).render('error', { title: 'Hello People 🖐️', messageError: 'Correo o contraseña invalidos.' })
    }
    logger.debug(`user: ${JSON.stringify(user, null, 2)}`)
    const token = generateToken(user)

    let minutos = 60

    setTimeout(() => {
      res
      .status(200)
      .cookie('access_token', token, { maxAge: 1000 * 60 * minutos, httpOnly: true })
      .json({ message: 'Cookie set successfully' , name: `${user.first_name}`,type:'login'});
       
    }, 1000);

   
  }


  static register = async (req, res, next) => {

    try {

      console.log(req.body)

      const { first_name, last_name, email, password, age } = req.body;



      if (!first_name || !last_name || !email || !password || !age) {
        return done(new Error('Todos los campos son requeridos.'));
      }

      const findEmail = await SessionMongoDAO.getUser(email)

      logger.debug(`findEmail: ${findEmail}`)


      if (findEmail) {
        return res.status(409).json({ error: 'Ya existe un usuario con el correo en el sistema.' });
      }


   
      const newCart = async () => {

        try {

          const newCart = {
            products: []
          }

          const resultado = await cartService.create(newCart)
          logger.debug(`cartId es por ahora: ${resultado}`)


          const newUserRegister = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role: "user",
            cart: `${resultado._id}`
          }
          const newUser = await SessionMongoDAO.createUser(newUserRegister);




        } catch (error) {
          console.error('Error al ejecutar el método:', error);
        }

      }


      newCart()


      res.status(201).json({message:'Registro Exitoso', type:'register'})
    } catch (error) {
      next(error);
    }
  }


  static recoverPassword = async (req, res) => {
    const { body: { email, password } } = req
    if (!email || !password) {
      //return res.status(400).json({ message: 'Todos los campos son requeridos.' })
      return res.status(400).render('error', { messageError: 'Todos los campos son requeridos.' })
    }
    const user = await SessionMongoDAO.getUser(email)
    if (!user) {
      //return res.status(401).json({ message: 'Correo o contraseña invalidos.' })
      return res.status(401).render('error', { messageError: 'Correo o contraseña invalidos.' })
    }
    user.password = createHash(password)
    await SessionMongoDAO.updateUser(email, user)
    res.status(200).redirect('/login')
  }

}