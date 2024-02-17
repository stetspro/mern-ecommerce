import config from "../config/config.js";
import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export let UserDAO
export let ProductDAO
export let CartDAO
export let MessageDAO
export let TicketDAO

logger.info(`Persistence with ${config.persistence}`)

switch (config.persistence) {
    case "MONGO":

        await mongoose.connect(config.mongoUrl, { dbName: config.mongoDbName })
        logger.info(`Connected to ${config.mongoUrl}/${config.mongoDbName}`)

        const { default: UserMongo } = await import('./mongo/user.mongo.js')
        const { default: ProductMongo } = await import('./mongo/product.mongo.js')
        const { default: CartMongo } = await import('./mongo/cart.mongo.js')
        const { default: MessageMongo } = await import('./mongo/message.mongo.js')
        const { default: TicketMongo } = await import('./mongo/ticket.mongo.js')

        UserDAO = UserMongo
        ProductDAO = ProductMongo
        CartDAO = CartMongo
        MessageDAO = MessageMongo
        TicketDAO = TicketMongo

        break;

    // case "FILE":
    //   break;

    default:
        throw new Error('Persistence not recognized')
}