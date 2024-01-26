import Router from './router.js'
import { generateProducts } from '../mock.js'

export default class MockRouter extends Router {
    init() {
        this.get('/', ['USER_ROLE'], (req, res) => {
            res.send('Hello World!')
        })

        this.get('/mockingproducts', ['PUBLIC'], async (req, res) => {
            const products = await generateProducts(100)
            res.sendSuccess(products)
        })
    }
}