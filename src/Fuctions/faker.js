import { faker } from '@faker-js/faker'
import { generateRandomCode } from './utils.js'

export function generateProducts() {
    const generatedCode = generateRandomCode(8)

    const product = {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({symbol: '$'}),
        thumbnail: faker.image.url(),
        code: generatedCode,
        stock: faker.number.int(100),
        status: faker.datatype.boolean(),
        category: faker.commerce.department(),
    }

    return product
}