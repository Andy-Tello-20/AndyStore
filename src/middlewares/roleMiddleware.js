import { logger } from "../utils.js";
export const authRolesMiddleware = (role) => (req, res, next) => {
  if(!req.user) {
    return res.status(401).json({ message: 'Desautorizado' });
  }
  const { role : userRole } = req.user;

  logger.debug(`el rol del usuario es: ${userRole}`)
 
  if (userRole !== role) {
    
    return res.status(403).render('error', { title: 'NoPermission', messageError: 'No tienes permiso para realizar esta operación' });
  }
  next();
};


