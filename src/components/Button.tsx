import type { ReactNode } from 'react'
import styles from './Button.module.css'

type Props = {
  href: string
  variant?: 'solid' | 'ghost'
  children: ReactNode
}

export function Button({ href, variant = 'solid', children }: Props) {
  return (
    <a href={href} className={`${styles.button} ${styles[variant]}`}>
      {children}
    </a>
  )
}
