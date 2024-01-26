import { faker } from '@faker-js/faker'

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        stock: faker.number.int({ max: 100 }),
        thumbnail: faker.image.urlLoremFlickr(),
        code: faker.string.uuid(),
        status: true,
        category: faker.commerce.department(),
        description: faker.lorem.paragraph(),
    }
}

export const generateProducts = async (amount) => {
    const products = []

    for (let i = 0; i < amount; i++) {
        products.push(generateProduct())
    }

    const response = {
        payload: products,
        totalPages: 1,
        page: 1,
        prevPage: null,
        nextPage: null,
        hasPrevPage: false,
        hasNextPage: false,
        prevLink: null,
        nextLink: null
    }

    return response
}