import classNames from 'classnames'

import styles from './card.module.css'

const Card = ({ children, className: wrapperStyle }) => {
  return (
    <div
      className={classNames(
        'bg-gray-100 rounded-sm overflow-hidden',
        styles.wrapper,
        wrapperStyle
      )}
    >
      {children}
    </div>
  )
}

export default Card
