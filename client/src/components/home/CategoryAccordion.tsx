import { useState } from 'react'
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
  // Гармошка: наведённая (или сфокусированная) категория раскрывается шире.
  // Тексты видимы всегда — прятать контент за hover нельзя (урок волны 1).
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <section id="catalog" className="bg-background py-10 md:py-14">
      <div className="container-app">
        <h2 className="text-h2 font-heading font-bold mb-3 md:mb-8">
          Категории
        </h2>

        <div className="flex flex-col md:flex-row gap-3 md:gap-2">
          {categories.map((cat, idx) => (
            <Link
              key={cat.slug}
              to={`/catalog/${cat.slug}`}
              onMouseEnter={() => setActiveIdx(idx)}
              onFocus={() => setActiveIdx(idx)}
              className={`
                relative min-w-0 overflow-hidden rounded-block group
                transition-[flex-grow] duration-300 ease-out
                ${cat.bgColor} ${cat.textColor}
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                md:min-h-80 min-h-40
              `}
              style={{ flexGrow: activeIdx === idx ? 2 : 1, flexBasis: 0 }}
            >
              {/* Крупный номер-фон */}
              <div className="hidden md:block absolute right-3 bottom-1 text-9xl font-heading font-bold opacity-10 pointer-events-none leading-none select-none">
                {cat.num}
              </div>

              <div className="p-4 md:p-6 flex flex-col h-full">
                <div className="text-label font-bold opacity-70 mb-2 whitespace-nowrap">
                  {cat.num} · {cat.shortLabel}
                </div>
                <h3
                  className={`font-heading font-bold mb-3 hyphens-auto transition-[font-size] duration-300 text-h3 ${
                    activeIdx === idx ? 'md:text-h3' : 'md:text-xl'
                  }`}
                >
                  {cat.title}
                </h3>
                <p
                  className={`text-body leading-body opacity-90 flex-1 transition-opacity duration-300 ${
                    activeIdx === idx ? 'md:opacity-90' : 'md:opacity-0'
                  }`}
                >
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
