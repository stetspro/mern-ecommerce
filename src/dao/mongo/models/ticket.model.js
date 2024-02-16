import mongoose from "mongoose";
import { randomUUID } from "crypto";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
    code: { 
        type: 'UUID',
        default: () => randomUUID(),
        required: true
    },
    purchase_datetime: { type: Date, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true, max: 100 },
    items: { type: Array, required: true }
});

export const TicketModel = mongoose.model(ticketCollection, ticketSchema);