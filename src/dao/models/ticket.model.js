import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from "uuid";


const ticketSchema = new Schema({
  code: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Referencia al modelo Product
      },
      quantity: { type: Number, required: true },
      title:{ type: String, required: true },
      price:{ type: Number, required: true }
    },
  ],
}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);