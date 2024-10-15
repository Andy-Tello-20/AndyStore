import UserModel from "./models/user.model.js";


export default class SessionMongoDAO {

    static async getUser (email){

        return await UserModel.findOne({ email: email })

    }

    static async createUser (newUserRegister){
        
        return await UserModel.create(newUserRegister)
    }


    static async updateUser (email,user){
        return await UserModel.updateOne({email},user)
    }
}