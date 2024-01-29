export const generateUserErrorInfo = (user) => {
    return `
        Uno o mas propiedades estan incompletos o son invalidos.
        Lista de Propiedades obligatorias
         - first_name: Must be a string (${user?.first_name})
         - last_name: Must be a string (${user?.last_name})
         - email: Must be a string (${user?.email})
         - password: Must be a string
         - confirmPassword: Must be a string
         - age: Must be a number between 18 and 65 (${user?.age})
    `
}

export const generateProductErrorInfo = (product) => {
    return `
        Uno o mas propiedades estan incompletos o son invalidos.
        Lista de Propiedades obligatorias
         - title: Must be a string (${product?.name})
         - price: Must be a number (${product?.price})
         - stock: Must be a number (${product?.stock})
         - thumbnail: Must be a string (${product?.thumbnail})
         - code: Must be a string (${product?.code})
         - description: Must be a string (${product?.description})
    `
}

export const generateOrderErrorInfo = (order) => {
    return `
        Uno o mas propiedades estan incompletos o son invalidos.
        Lista de Propiedades obligatorias
         - userEmail: Must be a string (${order?.email})
         - cid: Must be a string (${order?.cid})
    `
}