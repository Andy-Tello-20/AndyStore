import { logger } from "../utils.js";
import TicketMongoDAO from "../dao/ticketDAO.js";
import QRCode from 'qrcode';



export default class ticketController {


    static getTicket = async (req, res) => {
        try {
            // logger.debug(`req.user : ,${JSON.stringify(req.user, null, 2)}`)
            if (!req.user) {
                return res.redirect('/login')
            }

            const ticketId = req.user.email

            let ticket

            if (ticketId) {
                // Obtén el ticket desde la base de datos
                ticket = await TicketMongoDAO.getTicket(ticketId);

                let products= ticket.products.map(p => p.toJSON())
              

                const productosConImporte = products.map(producto => ({
                    ...producto,
                    import: producto.quantity * producto.price
                  }));
                  
                

                const qrCodeData = `https://www.youtube.com/watch?v=Lz6YkEYflUU`; // URL o datos que quieras codificar
                const qrCodeImage = await QRCode.toDataURL(qrCodeData);
  

  
                // Asegúrate de que ticket no es null o undefined
                if (ticket) {
                    // Renderiza la plantilla 'ticket.hbs' con los datos del ticket
                    res.status(200).render('ticket', {
                        title: 'Ticket de Compra',
                        purchaser: ticket.purchaser,
                        code: ticket.code,
                        amount: ticket.amount,
                        purchase_datetime: new Date(ticket.purchase_datetime).toLocaleString(),
                        products: productosConImporte,
                        qr_code: qrCodeImage
                    });
                } else {
                    res.status(404).send('Ticket no encontrado');
                }
            } else {
                res.status(400).send('ID del ticket no proporcionado');
            }


        } catch (error) {
            logger.error(`Error al obtener el ticket: ${error}`)
            res.status(500).render('error', { error: 'Error al obtener el ticket' });
        }


    }

}