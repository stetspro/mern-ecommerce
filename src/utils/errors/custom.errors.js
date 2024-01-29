import EErrors from "./enums.js"
import { generateUserErrorInfo, generateProductErrorInfo } from "./info.js"

export default class CustomError {

    static createError({ name = 'Error', cause, message, code }) {
        const error = new Error(message, { cause })
        error.name = name
        error.code = code

        throw error
    }

    static createUser(user) {
        CustomError.createError({
            name: 'User creation error',
            cause: generateUserErrorInfo(user),
            message: 'Error trying to create user',
            code: EErrors.INVALID_TYPES_ERROR
        })
    }

    static createProduct(product) {
        CustomError.createError({
            name: 'Product creation error',
            cause: generateProductErrorInfo(product),
            message: 'Error trying to create product',
            code: EErrors.INVALID_TYPES_ERROR
        })
    }

    static login() {
        CustomError.createError({
            name: 'Login error',
            cause: 'Invalid email or password',
            message: 'Error trying to login',
            code: EErrors.LOGIN_ERROR
        })
    }

    static createOrder() {
        CustomError.createError({
            name: 'Ticket creation error',
            cause: 'Invalid ticket data',
            message: 'Error trying to create ticket',
            code: EErrors.INVALID_TYPES_ERROR
        })
    }

    static deleteProduct() {
        CustomError.createError({
            name: 'Product deletion error',
            cause: 'Invalid product id',
            message: 'Error trying to delete product',
            code: EErrors.INVALID_TYPES_ERROR
        })
    }

}