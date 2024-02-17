import { UserDAO, ProductDAO, CartDAO, MessageDAO, TicketDAO } from '../dao/factory.js'
import Mail from '../modules/mail.module.js'

import UserRepository from './user.repository.js'
import ProductRepository from './product.repository.js'
import CartRepository from './cart.repository.js'
import MessageRepository from './message.repository.js'
import TicketRepository from './ticket.repository.js'

const userDao = new UserDAO();
const productDao = new ProductDAO();
const cartDao = new CartDAO();
const messageDao = new MessageDAO();
const ticketDao = new TicketDAO();
const mailModule = new Mail();

export const UserService = new UserRepository(userDao, mailModule)
export const ProductService = new ProductRepository(productDao)
export const CartService = new CartRepository(cartDao, productDao, ticketDao)
export const MessageService = new MessageRepository(messageDao)
export const TicketService = new TicketRepository(ticketDao)