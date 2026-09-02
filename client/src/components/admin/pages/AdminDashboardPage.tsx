import { useEffect, useState } from 'react'
import { adminDashboard, type AdminDashboardData } from '@/lib/admin-api'
import { ApiError } from '@/lib/api'
import { formatPrice } from '@/lib/format'

export function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const result = await adminDashboard()
        setData(result)
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message || 'Ошибка при загрузке данных')
        } else {
          setError('Нет соединения с сервером')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="container-app py-12">
        <div className="text-muted-foreground">Загрузка…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-app py-12">
        <div className="bg-destructive/10 text-destructive p-4 rounded-block">
          {error}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container-app py-12">
        <div className="text-muted-foreground">Данные не загружены</div>
      </div>
    )
  }

  return (
    <div className="container-app py-12 md:py-16">
      <h1 className="text-h2 font-heading font-bold text-foreground mb-8 uppercase">
        Дашборд
      </h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-card p-6 rounded-block border border-border">
          <div className="text-muted-foreground text-sm font-sans mb-2">
            Всего заказов
          </div>
          <div className="text-3xl font-heading font-bold text-foreground">
            {data.ordersTotal}
          </div>
        </div>

        <div className="bg-card p-6 rounded-block border border-border">
          <div className="text-muted-foreground text-sm font-sans mb-2">
            Новых заказов
          </div>
          <div className="text-3xl font-heading font-bold text-primary">
            {data.ordersNew}
          </div>
        </div>

        <div className="bg-card p-6 rounded-block border border-border">
          <div className="text-muted-foreground text-sm font-sans mb-2">
            В пути
          </div>
          <div className="text-3xl font-heading font-bold text-primary">
            {data.ordersInTransit}
          </div>
        </div>

        <div className="bg-card p-6 rounded-block border border-border">
          <div className="text-muted-foreground text-sm font-sans mb-2">
            Выручка
          </div>
          <div className="text-2xl font-heading font-bold text-success tabular-nums">
            {formatPrice(data.revenue)}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div>
        <h2 className="text-h3 font-heading font-bold text-foreground mb-4">
          Лучшие товары
        </h2>
        <div className="bg-card rounded-block border border-border overflow-hidden">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">
                  Товар
                </th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">
                  Продано
                </th>
              </tr>
            </thead>
            <tbody>
              {data.topProducts.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-muted-foreground">
                    Нет данных
                  </td>
                </tr>
              ) : (
                data.topProducts.map((product, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/30">
                    <td className="px-6 py-4 text-foreground">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-foreground font-semibold">
                      {product.quantity}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
