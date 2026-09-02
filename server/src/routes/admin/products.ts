import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { adminProductService } from '../../services/admin-product.service.js'
import { ApiError } from '../../lib/errors.js'

const listVariantsSchema = z.object({
  search: z.string().max(100).optional(),
  isActive: z.enum(['true', 'false']).optional().transform((v) => v === 'true' ? true : v === 'false' ? false : undefined),
  lowStock: z.enum(['true', 'false']).optional().transform((v) => v === 'true' ? true : v === 'false' ? false : undefined),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
})

const updateVariantSchema = z.object({
  stock: z.number().int().min(0).optional(),
  retailPrice: z.number().int().min(1).optional(),
  isActive: z.boolean().optional(),
})

const updateProductSchema = z.object({
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
})

export async function productsRoutes(app: FastifyInstance, preHandlers: any[]) {
  // GET /api/v1/admin/variants
  app.get<{ Querystring: any; Reply: any }>(
    '/variants',
    {
      preHandler: preHandlers,
      schema: {
        querystring: {
          type: 'object',
          properties: {
            search: { type: 'string' },
            isActive: { type: 'string', enum: ['true', 'false'] },
            lowStock: { type: 'string', enum: ['true', 'false'] },
            limit: { type: 'integer', minimum: 1, maximum: 100 },
            offset: { type: 'integer', minimum: 0 },
          },
        },
        response: {
          200: {
            type: 'object',
            additionalProperties: false,
            required: ['items', 'total', 'limit', 'offset'],
            properties: {
              items: {
                type: 'array',
                items: { $ref: 'ps.adminVariant#' },
              },
              total: { type: 'integer' },
              limit: { type: 'integer' },
              offset: { type: 'integer' },
            },
          },
          401: { $ref: 'ps.error#' },
          403: { $ref: 'ps.error#' },
        },
      },
    },
    async (request: FastifyRequest<{ Querystring: any }>, reply: FastifyReply) => {
      const result = listVariantsSchema.safeParse(request.query)
      if (!result.success) {
        throw new ApiError(400, 'VALIDATION_ERROR', 'Ошибка валидации')
      }

      const data = await adminProductService.listVariants({
        search: result.data.search,
        isActive: result.data.isActive,
        lowStock: result.data.lowStock,
        limit: result.data.limit,
        offset: result.data.offset,
      })

      reply.code(200)
      return data
    }
  )

  // PATCH /api/v1/admin/variants/:id
  app.patch<{ Params: { id: string }; Body: any; Reply: any }>(
    '/variants/:id',
    {
      preHandler: preHandlers,
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        body: {
          type: 'object',
          additionalProperties: false,
          properties: {
            stock: { type: 'integer', minimum: 0 },
            retailPrice: { type: 'integer', minimum: 1 },
            isActive: { type: 'boolean' },
          },
        },
        response: {
          200: { $ref: 'ps.adminVariant#' },
          400: { $ref: 'ps.error#' },
          404: { $ref: 'ps.error#' },
          401: { $ref: 'ps.error#' },
          403: { $ref: 'ps.error#' },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string }; Body: any }>, reply: FastifyReply) => {
      const result = updateVariantSchema.safeParse(request.body)
      if (!result.success) {
        throw new ApiError(400, 'VALIDATION_ERROR', 'Ошибка валидации')
      }

      const variant = await adminProductService.updateVariant(request.params.id, result.data)

      reply.code(200)
      return variant
    }
  )

  // PATCH /api/v1/admin/products/:id
  app.patch<{ Params: { id: string }; Body: any; Reply: any }>(
    '/products/:id',
    {
      preHandler: preHandlers,
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        body: {
          type: 'object',
          additionalProperties: false,
          properties: {
            isActive: { type: 'boolean' },
            isFeatured: { type: 'boolean' },
          },
        },
        response: {
          200: {
            type: 'object',
            additionalProperties: false,
            required: ['id', 'name', 'slug', 'isActive', 'isFeatured'],
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              slug: { type: 'string' },
              isActive: { type: 'boolean' },
              isFeatured: { type: 'boolean' },
              minPrice: { type: 'integer' },
              maxPrice: { type: 'integer' },
              brand: {
                type: ['object', 'null'],
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                },
              },
            },
          },
          400: { $ref: 'ps.error#' },
          404: { $ref: 'ps.error#' },
          401: { $ref: 'ps.error#' },
          403: { $ref: 'ps.error#' },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string }; Body: any }>, reply: FastifyReply) => {
      const result = updateProductSchema.safeParse(request.body)
      if (!result.success) {
        throw new ApiError(400, 'VALIDATION_ERROR', 'Ошибка валидации')
      }

      const product = await adminProductService.updateProduct(request.params.id, result.data)

      reply.code(200)
      return product
    }
  )
}
