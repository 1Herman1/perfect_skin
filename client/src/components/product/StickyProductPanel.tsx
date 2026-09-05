import { useEffect, useState } from 'react'
import { formatPrice } from '@/lib/format'
import { useCart } from '@/context/CartContext'
import { useDrawer } from '@/context/DrawerContext'
import { useFavorites } from '@/context/FavoritesContext'
import { IconHeart, IconHeartSolid } from '../icons'
import type { ProductCardExtended } from '@/types/api'

interface StickyProductPanelProps {
  product: ProductCardExtended
  buttonRef: React.RefObject<HTMLDivElement>
  onAddToCart?: () => void
}

export function StickyProductPanel({
  product,
  buttonRef,
  onAddToCart,
}: StickyProductPanelProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { addItem } = useCart()
  const { openCart } = useDrawer()
  const { isFavorite, toggle } = useFavorites()
  const [addingState, setAddingState] = useState<'idle' | 'loading' | 'success'>('idle')

  const isFav = isFavorite(product.slug)

  const handleAddToCart = async () => {
    if (!product.inStock || product.variants.length === 0) return

    try {
      setAddingState('loading')
      await addItem(product.variants[0].id, 1)
      setAddingState('success')
      openCart()

      setTimeout(() => {
        setAddingState('idle')
      }, 1500)
    } catch {
      setAddingState('idle')
    }

    if (onAddToCart) {
      onAddToCart()
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky panel when button is NOT visible
        setIsVisible(!entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (buttonRef.current) {
      observer.observe(buttonRef.current)
    }

    return () => {
      if (buttonRef.current) {
        observer.unobserve(buttonRef.current)
      }
    }
  }, [buttonRef])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 shadow-lg z-40 animate-in slide-in-from-bottom-2">
      <div className="container-app flex items-center justify-between gap-4">
        {/* Price */}
        <p className="font-semibold text-foreground whitespace-nowrap tabular-nums text-lg">
          {formatPrice(product.minPrice)}
        </p>

        {/* Button + Favorite */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || addingState === 'loading'}
            className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity whitespace-nowrap min-h-11"
          >
            {addingState === 'success'
              ? 'Добавлено ✓'
              : addingState === 'loading'
                ? 'Добавляю...'
                : product.inStock
                  ? 'В корзину'
                  : 'Недоступно'}
          </button>

          <button
            onClick={() => toggle(product.slug)}
            aria-pressed={isFav}
            aria-label={isFav ? 'Убрать из избранного' : 'Добавить в избранное'}
            className="w-11 h-11 flex items-center justify-center hover:bg-muted rounded-full transition-colors duration-200 flex-shrink-0"
          >
            {isFav ? (
              <IconHeartSolid className="w-5 h-5 text-primary" />
            ) : (
              <IconHeart className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
