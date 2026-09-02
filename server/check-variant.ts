import { db } from './src/lib/db.js'

const variant = await db.productVariant.findFirst({
  where: {
    OR: [
      { sku: { not: null } },
      { externalId: { not: null } },
    ],
  },
  include: { product: true },
})

if (variant) {
  console.log('Found variant:', {
    id: variant.id,
    sku: variant.sku,
    externalId: variant.externalId,
    stock: variant.stock,
    retailPrice: variant.retailPrice,
    productName: variant.product.name,
  })
} else {
  console.log('No variants found')
}

await db.$disconnect()
