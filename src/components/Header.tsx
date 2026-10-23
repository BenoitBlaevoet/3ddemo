import styles from './Header.module.css'

const LINKS = [
  { href: '#flip', label: 'Flip' },
  { href: '#colors', label: 'Colors' },
  { href: '#specs', label: 'Specs' },
]

export function Header() {
  return (
    <header className={styles.header}>
      <a href="#top" className={styles.logo} aria-label="GULP, back to top">
        GULP<span className={styles.kana}>ガルプ</span>
      </a>
      <nav className={styles.nav} aria-label="Sections">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} className={styles.link}>
            {link.label}
          </a>
        ))}
        <a href="#buy" className={`${styles.link} ${styles.buy}`}>
          Buy
        </a>
      </nav>
    </header>
  )
}
