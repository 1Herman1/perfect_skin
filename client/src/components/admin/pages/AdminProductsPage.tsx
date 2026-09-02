import { useEffect, useState } from 'react'
import { adminListVariants, adminUpdateVariant, type AdminVariant } from '@/lib/admin-api'
import { ApiError } from '@/lib/api'
import { formatPrice } from '@/lib/format'

export function AdminProductsPage() {
  const [variants, setVariants] = useState<AdminVariant[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const [offset, setOffset] = useState(0)
  const limit = 20

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await adminListVariants({
        search: search || undefined,
        lowStock: lowStockOnly || undefined,
        offset,
        limit,
      })
      setVariants(result.items)
      setTotal(result.total)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Ошибка при загрузке товаров')
      } else {
        setError('Нет соединения с сервером')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [lowStockOnly, offset])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOffset(0)
    load()
  }

  const handleNext = () => {
    if (offset + limit < total) {
      setOffset(offset + limit)
    }
  }

  const handlePrev = () => {
    if (offset > 0) {
      setOffset(Math.max(0, offset - limit))
    }
  }

  return (
    <div className="container-app py-12 md:py-16">
      <h1 className="text-h2 font-heading font-bold text-foreground mb-8 uppercase">
        Товары
      </h1>

      {/* Filters */}
      <div className="bg-card border border-border rounded-block p-6 mb-8">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label
                htmlFor="search"
                className="block text-label font-sans text-muted-foreground mb-2"
              >
                Поиск
              </label>
              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Название или SKU…"
                className="w-full px-4 py-2 border border-border-strong rounded-block font-sans text-foreground placeholder:text-muted-foreground bg-background focus:outline-ring focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Submit */}
            <div className="flex items-end gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground font-sans font-semibold rounded-block hover:bg-primary/90 transition-colors min-h-11"
              >
                Поиск
              </button>
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="lowStock"
              checked={lowStockOnly}
              onChange={(e) => {
                setLowStockOnly(e.target.checked)
                setOffset(0)
              }}
              className="w-4 h-4 rounded border-border-strong cursor-pointer"
            />
            <label htmlFor="lowStock" className="text-label font-sans text-foreground cursor-pointer">
              Только заканчивающиеся (≤ 3)
            </label>
          </div>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-block mb-6">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-block overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">
                  Товар
                </th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">
                  Объём
                </th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">
                  Цена
                </th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">
                  Остаток
                </th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">
                  Активен
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Загрузка…
                  </td>
                </tr>
              ) : variants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Нет товаров
                  </td>
                </tr>
              ) : (
                variants.map((variant) => (
                  <VariantRow
                    key={variant.id}
                    variant={variant}
                    onUpdate={() => load()}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && variants.length > 0 && (
        <div className="flex items-center justify-between text-sm font-sans text-muted-foreground">
          <div>
            Показано {offset + 1}–{Math.min(offset + limit, total)} из {total}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              disabled={offset === 0}
              className="px-4 py-2 border border-border rounded-block text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-11"
            >
              Назад
            </button>
            <button
              onClick={handleNext}
              disabled={offset + limit >= total}
              className="px-4 py-2 border border-border rounded-block text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-11"
            >
              Дальше
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────── Строка варианта ────────────────────────────────

interface VariantRowProps {
  variant: AdminVariant
  onUpdate: () => void
}

function VariantRow({ variant, onUpdate }: VariantRowProps) {
  const [priceEdit, setPriceEdit] = useState(false)
  const [priceValue, setPriceValue] = useState(formatPriceForInput(variant.retailPrice))
  const [priceError, setPriceError] = useState('')
  const [priceSaving, setPriceSaving] = useState(false)
  const [priceFlash, setPriceFlash] = useState(false)

  const [stockEdit, setStockEdit] = useState(false)
  const [stockValue, setStockValue] = useState(String(variant.stock))
  const [stockError, setStockError] = useState('')
  const [stockSaving, setStockSaving] = useState(false)
  const [stockFlash, setStockFlash] = useState(false)

  const [isActiveSaving, setIsActiveSaving] = useState(false)
  const [isActiveFlash, setIsActiveFlash] = useState(false)

  const handlePriceBlur = async () => {
    setPriceError('')
    const trimmed = priceValue.trim()
    if (!trimmed) {
      setPriceEdit(false)
      setPriceValue(formatPriceForInput(variant.retailPrice))
      return
    }

    try {
      const kopecks = parsePrice(trimmed)
      if (kopecks <= 0) {
        setPriceError('Цена должна быть больше 0')
        return
      }

      if (kopecks === variant.retailPrice) {
        setPriceEdit(false)
        return
      }

      setPriceSaving(true)
      await adminUpdateVariant(variant.id, { retailPrice: kopecks })
      setPriceFlash(true)
      setTimeout(() => setPriceFlash(false), 600)
      setPriceEdit(false)
      onUpdate()
    } catch (err) {
      if (err instanceof ApiError) {
        setPriceError(err.message || 'Ошибка при сохранении')
      } else {
        setPriceError('Ошибка при сохранении')
      }
    } finally {
      setPriceSaving(false)
    }
  }

  const handleStockBlur = async () => {
    setStockError('')
    const trimmed = stockValue.trim()
    if (!trimmed) {
      setStockEdit(false)
      setStockValue(String(variant.stock))
      return
    }

    try {
      const num = parseInt(trimmed, 10)
      if (isNaN(num) || num < 0) {
        setStockError('Остаток должен быть числом ≥ 0')
        return
      }

      if (num === variant.stock) {
        setStockEdit(false)
        return
      }

      setStockSaving(true)
      await adminUpdateVariant(variant.id, { stock: num })
      setStockFlash(true)
      setTimeout(() => setStockFlash(false), 600)
      setStockEdit(false)
      onUpdate()
    } catch (err) {
      if (err instanceof ApiError) {
        setStockError(err.message || 'Ошибка при сохранении')
      } else {
        setStockError('Ошибка при сохранении')
      }
    } finally {
      setStockSaving(false)
    }
  }

  const handlePriceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePriceBlur()
    }
  }

  const handleStockKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStockBlur()
    }
  }

  const handleToggleActive = async () => {
    try {
      setIsActiveSaving(true)
      await adminUpdateVariant(variant.id, { isActive: !variant.isActive })
      setIsActiveFlash(true)
      setTimeout(() => setIsActiveFlash(false), 600)
      onUpdate()
    } catch (err) {
      // Error shown at page level
    } finally {
      setIsActiveSaving(false)
    }
  }

  const lowStockClass = variant.stock <= 3 ? 'bg-destructive/10' : ''
  const priceFlashClass = priceFlash ? 'animate-pulse bg-success/20' : ''
  const stockFlashClass = stockFlash ? 'animate-pulse bg-success/20' : ''
  const isActiveFlashClass = isActiveFlash ? 'animate-pulse bg-success/20' : ''

  return (
    <tr key={variant.id} className="border-b border-border hover:bg-muted/30">
      {/* Product */}
      <td className="px-6 py-4 text-foreground">
        <div className="font-semibold">{variant.product.name}</div>
        {variant.product.brand && (
          <div className="text-xs text-muted-foreground">{variant.product.brand.name}</div>
        )}
        {variant.sku && (
          <div className="text-xs text-muted-foreground">SKU: {variant.sku}</div>
        )}
      </td>

      {/* Volume */}
      <td className="px-6 py-4 text-foreground text-sm">
        {variant.volumeLabel}
      </td>

      {/* Price */}
      <td className={`px-6 py-4 text-foreground font-semibold tabular-nums transition-colors ${priceFlashClass}`}>
        {priceEdit ? (
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={priceValue}
              onChange={(e) => {
                setPriceValue(e.target.value)
                setPriceError('')
              }}
              onBlur={handlePriceBlur}
              onKeyDown={handlePriceKeyDown}
              placeholder="0,00"
              disabled={priceSaving}
              autoFocus
              className="px-2 py-1 border border-border rounded text-sm bg-background text-foreground focus:outline-ring focus:ring-1 focus:ring-ring disabled:opacity-50"
            />
            {priceError && (
              <div className="text-xs text-destructive">{priceError}</div>
            )}
          </div>
        ) : (
          <button
            onClick={() => {
              setPriceEdit(true)
              setPriceValue(formatPriceForInput(variant.retailPrice))
              setPriceError('')
            }}
            className="text-primary hover:underline focus-visible:outline-ring text-left"
          >
            {formatPrice(variant.retailPrice)}
          </button>
        )}
      </td>

      {/* Stock */}
      <td className={`px-6 py-4 text-foreground tabular-nums transition-colors ${lowStockClass} ${stockFlashClass}`}>
        {stockEdit ? (
          <div className="flex flex-col gap-1">
            <input
              type="number"
              value={stockValue}
              onChange={(e) => {
                setStockValue(e.target.value)
                setStockError('')
              }}
              onBlur={handleStockBlur}
              onKeyDown={handleStockKeyDown}
              disabled={stockSaving}
              autoFocus
              className="px-2 py-1 border border-border rounded text-sm bg-background text-foreground focus:outline-ring focus:ring-1 focus:ring-ring disabled:opacity-50 w-20"
            />
            {stockError && (
              <div className="text-xs text-destructive">{stockError}</div>
            )}
          </div>
        ) : (
          <button
            onClick={() => {
              setStockEdit(true)
              setStockValue(String(variant.stock))
              setStockError('')
            }}
            className="text-primary hover:underline focus-visible:outline-ring"
          >
            {variant.stock}
          </button>
        )}
      </td>

      {/* Is Active */}
      <td className={`px-6 py-4 transition-colors ${isActiveFlashClass}`}>
        <div className="flex items-center min-h-11">
          <button
            onClick={handleToggleActive}
            disabled={isActiveSaving}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
              variant.isActive
                ? 'bg-success'
                : 'bg-muted'
            } ${isActiveSaving ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
            aria-label={variant.isActive ? 'Деактивировать' : 'Активировать'}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                variant.isActive ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ──────────────────────────────── Утилиты ────────────────────────────────

/**
 * Преобразует копейки (число) в строку формата "1990,50"
 */
function formatPriceForInput(kopecks: number): string {
  const rubles = kopecks / 100
  const parts = rubles.toString().split('.')
  const wholePart = parts[0]
  const fractionalPart = (parts[1] || '').padEnd(2, '0').slice(0, 2)
  return `${wholePart},${fractionalPart}`
}

/**
 * Преобразует строку "1990,50" в копейки (число)
 */
function parsePrice(input: string): number {
  // Заменяем запятую на точку для парсинга
  const normalized = input.replace(',', '.')
  const rubles = parseFloat(normalized)
  if (isNaN(rubles)) {
    throw new Error('Неверный формат цены')
  }
  return Math.round(rubles * 100)
}
