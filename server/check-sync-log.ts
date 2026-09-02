import { db } from './src/lib/db.js'

const logs = await db.syncLog.findMany({
  orderBy: { createdAt: 'desc' },
  take: 5,
})

console.log('Recent SyncLog entries:')
for (const log of logs) {
  console.log({
    direction: log.direction,
    status: log.status,
    itemsCount: log.itemsCount,
    errorText: log.errorText,
    createdAt: log.createdAt.toISOString(),
  })
}

await db.$disconnect()
