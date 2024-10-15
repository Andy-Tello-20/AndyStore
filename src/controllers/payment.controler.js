import paymentDao from "../dao/payment.DAO.js"

export default class paymentController {


    static paySuccess = async (req, res) => {
        try {
            const userCart = req.user.cart
            const userEmail = req.user.email
            const { collection_id, collection_status, payment_type } = req.query

            console.log('userCart: ',userCart, 'userEmail: ',userEmail)
            console.log('ID de la transacción:', collection_id)
            console.log('Estado de la transacción:', collection_status)
            console.log('Tipo de pago:', payment_type)

            if (collection_status == 'approved') {
                const process = await paymentDao.updateCart(userCart, userEmail)

                console.log('process es: ', process)
                res.redirect('http://localhost:3000/')
                // res.status(201).json(process)
            } else {
                res.send({ error: 'pago no aprovado' })
            }

        } catch (error) {

            res.status(500).json({ error: 'Error interno del servidor' })
        }

    }

    static payRejected = async (req, res) => {
        try {

        } catch (error) {

        }

    }


    static payPending = async (req, res) => {
        try {

        } catch (error) {

        }

    }



}