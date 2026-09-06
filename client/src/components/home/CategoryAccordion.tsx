import { useState } from 'react'
import { Link } from 'react-router-dom'

const categories = [
  {
    num: '01',
    title: 'Уход за лицом',
    eyebrow: 'Кремы, сыворотки и маски ISSEIMI',
    slug: 'kremy-dlya-litsa-i-shei',
    photo: '/products-optimized/dinamizante-vosstanavlivayushhij-krem/card.webp',
    bgColor: 'bg-accent',
  },
  {
    num: '02',
    title: 'Сыворотки',
    eyebrow: 'Активные концентраты для интенсивного ухода',
    slug: 'syvorotki',
    photo: '/products-optimized/collagen-booster-vosstanavlivayushhaya-syvorotka/card.webp',
    bgColor: 'bg-accent/60',
  },
  {
    num: '03',
    title: 'Маски',
    eyebrow: 'Питающие и очищающие маски для лица',
    slug: 'maski',
    photo: '/products-optimized/tts-energizing-mask-maska-so-stvolovymi-kletkami/card.webp',
    bgColor: 'bg-accent/30',
  },
  {
    num: '04',
    title: 'Наборы',
    eyebrow: 'Готовые программы ухода и подарочные боксы',
    slug: 'nabory',
    photo:
      '/products-optimized/podarochnyj-nabor-bee-venom-s-pchelinym-yadom-dlya-razglazhivaniya-morshhin-i-ustraneniya-tusklosti-kozhi/card.webp',
    bgColor: 'bg-muted',
  },
]

export function CategoryAccordion() {
  // Гармошка в формате «раскрытая витрина»: активная карточка широкая —
  // надзаголовок, крупное имя, кнопка-стрелка и фото товара; свёрнутые —
  // узкие корешки с вертикальной подписью. На мобиле — простой столбец.
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <section id="catalog" className="bg-background py-10 md:py-14">
      <div className="container-app">
        <h2 className="text-h2 font-heading font-bold mb-3 md:mb-8">
          Категории
        </h2>

        <div className="flex flex-col md:flex-row gap-3 md:gap-3 md:h-[420px]">
          {categories.map((cat, idx) => {
            const active = activeIdx === idx
            return (
              <Link
                key={cat.slug}
                to={`/catalog/${cat.slug}`}
                onMouseEnter={() => setActiveIdx(idx)}
                onFocus={() => setActiveIdx(idx)}
                className={`
                  relative min-w-0 overflow-hidden rounded-block group
                  transition-[flex-grow] duration-300 ease-out
                  ${cat.bgColor} text-foreground
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                  min-h-44 md:min-h-0
                `}
                style={{ flexGrow: active ? 5 : 1, flexBasis: 0 }}
              >
                {/* Свёрнутый корешок: вертикальная подпись (только десктоп) */}
                <div
                  className={`hidden md:flex absolute inset-0 items-center justify-center transition-opacity duration-200 ${
                    active ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <span className="spine-vertical">{cat.title}</span>
                </div>

                {/* Раскрытое содержимое */}
                <div
                  className={`p-5 md:p-8 flex flex-col h-full transition-opacity duration-300 ${
                    active ? 'md:opacity-100' : 'md:opacity-0'
                  }`}
                >
                  <div className="text-label font-semibold opacity-70 mb-2 md:whitespace-nowrap">
                    {cat.eyebrow}
                  </div>
                  <h3 className="text-h3 md:text-h2 font-heading font-bold mb-4">
                    {cat.title}
                  </h3>
                  <span
                    className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                  <img
                    src={cat.photo}
                    alt=""
                    loading="lazy"
                    className="absolute right-2 bottom-0 w-40 md:w-64 max-w-[55%] object-contain pointer-events-none select-none mix-blend-multiply"
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
