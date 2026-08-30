// Prisma-клиент проекта. Отдельный клиент .prisma/ps-client был нужен, только
// пока проект жил внутри монорепозитория Симбы и делил с ней node_modules.
export * from '@prisma/client'
export { PrismaClient, $Enums } from '@prisma/client'

import { PrismaClient } from '@prisma/client'

export const db = new PrismaClient()
