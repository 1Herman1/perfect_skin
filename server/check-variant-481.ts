import { db } from './src/lib/db.js'

const variant = await db.productVariant.findUnique({
  where: { externalId: '481' },
  include: { product: true },
})

if (variant) {
  console.log('Variant 481:', {
    stock: variant.stock,
    retailPrice: variant.retailPrice,
    productName: variant.product.name,
  })
} else {
  console.log('Not found')
}

await db.$disconnect()
