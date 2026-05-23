import { cn } from '@/lib/utils'
import PropTypes from 'prop-types'

export default function Card({ children, className = '' }) {
  return (
    <div className={cn(
      'bg-card rounded-[2rem] border border-border p-8 shadow-2xl backdrop-blur-xl',
      className
    )}>
      {children}
    </div>
  )
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}