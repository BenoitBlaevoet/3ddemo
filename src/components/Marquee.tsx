import styles from './Marquee.module.css'

type Props = {
  items: string[]
  reverse?: boolean
}

const REPEAT = 4

export function Marquee({ items, reverse = false }: Props) {
  const run = Array.from({ length: REPEAT }, () => items).flat()

  return (
    <div className={`${styles.band} ${reverse ? styles.reverse : ''}`} aria-hidden="true">
      {[0, 1].map((copy) => (
        <div key={copy} className={styles.track}>
          {run.map((item, i) => (
            <span key={i} className={styles.item}>
              {item}
              <span className={styles.star}>★</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
