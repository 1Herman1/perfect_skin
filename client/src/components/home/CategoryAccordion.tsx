import { Link } from 'react-router-dom'

const categories = [
  {
    num: '01',
    title: 'Уход за лицом',
    shortLabel: 'Лицо',
    desc: 'Кремы, сыворотки и маски ISSEIMI для домашнего и кабинетного ухода.',
    slug: 'kremy-dlya-litsa-i-shei',
    bgColor: 'bg-accent',
    textColor: 'text-foreground',
  },
  {
    num: '02',
    title: 'Сыворотки',
    shortLabel: 'Сыворотки',
    desc: 'Активные концентраты для интенсивного ухода.',
    slug: 'syvorotki',
    bgColor: 'bg-accent/60',
    textColor: 'text-foreground',
  },
  {
    num: '03',
    title: 'Маски',
    shortLabel: 'Маски',
    desc: 'Питающие и очищающие маски для лица.',
    slug: 'maski',
    bgColor: 'bg-accent/30',
    textColor: 'text-foreground',
  },
  {
    num: '04',
    title: 'Наборы',
    shortLabel: 'Наборы',
    desc: 'Готовые программы ухода и подарочные боксы.',
    slug: 'nabory',
    bgColor: 'bg-muted',
    textColor: 'text-foreground',
  },
]

export function CategoryAccordion() {
  return (
    <section id="catalog" className="bg-background py-20 md:py-32">
      <div className="container-app">
        <h2 className="text-h2 font-heading font-bold mb-3 md:mb-16">
          Категории
        </h2>

        {/* Accordion: Desktop grid, mobile flex-col */}
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 md:h-full"
          style={{ minHeight: '160px' }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/catalog/${cat.slug}`}
              className={`
                relative overflow-hidden rounded-block
                transition-transform duration-300 ease-out
                group
                ${cat.bgColor} ${cat.textColor}
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                md:min-h-96 min-h-40
              `}
            >
              {/* Content */}
              <div className="p-4 md:p-6 flex flex-col h-full">
                <div className="text-label font-bold opacity-70 mb-2">
                  {cat.num} · {cat.shortLabel}
                </div>
                <h3 className="text-h3 font-heading font-bold mb-3">
                  {cat.title}
                </h3>
                <p className="text-body leading-body opacity-90 flex-1">
                  {cat.desc}
                </p>
                <div className="mt-4 text-body font-bold opacity-60">→</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
