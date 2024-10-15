import UserModel from './models/user.model.js'

export default class UserMongoDAO {


 static async findUserById (uid) {
    return await UserModel.findById(uid)
 }

 static async populateUser (uid) {
    return await UserModel.findById(uid).populate({
      path: 'cart',
      populate: {
          path: 'products.product', // Popula los detalles del producto
          model: 'Product', // Especifica el modelo Product para hacer la consulta
          
      }})
 }

 static async getUsers () {
    return await UserModel.find({})
 }      

 static async createUser (newUser){    
    return await UserModel.create(newUser)
}

static async updateUser (uid,body){
    return await UserModel.updateOne({_id: uid }, { $set: body })
}

static async deleteUser (uid){
    return await UserModel.deleteOne({ _id: uid })
}


} 