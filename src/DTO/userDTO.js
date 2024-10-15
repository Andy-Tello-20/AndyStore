export class UserDTO {

    constructor (usuario){

        this.fistName = usuario.first_name,
        this.lastName = usuario.last_name,
        this.age = usuario.age
        this.role = usuario.role
        this.email=usuario.email
    }

}