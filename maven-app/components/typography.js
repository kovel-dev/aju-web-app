import classNames from 'classnames'

const FONT_TYPES = ['heading', 'subheading', 'subheading-2', 'title', 'default']

const FONT_CONFIGS = {
  [FONT_TYPES[0]]: {
    color: 'text-blue-850',
    tag: 'h1',
    size: 'text-xl lg:text-4xl font-bold leading-8 lg:leading-10',
  },
  [FONT_TYPES[1]]: {
    color: 'text-blue-850',
    tag: 'h2',
    size: 'lg:text-3xl text-xl font-bold',
  },
  [FONT_TYPES[2]]: {
    color: 'text-blue-850',
    tag: 'h3',
    size: 'text-xl lg:text-2xl font-bold leading-8',
  },
  [FONT_TYPES[3]]: {
    color: 'text-blue-850',
    tag: 'div',
    size: 'text-xl lg:text-lg font-bold leading-9',
  },
  [FONT_TYPES[4]]: {
    color: 'text-gray-950 lg:text-lg',
    tag: 'div',
    size: 'font-medium font-mont',
  },
}

const Typography = ({
  variant = 'default',
  className = '',
  color = null,
  tag = null,
  children = null,
}) => {
  const fontVariant = FONT_TYPES.includes(variant) ? variant : 'default'
  const fontConfig = FONT_CONFIGS[fontVariant]
  const fontSize = fontConfig.size
  const fontColor = color || fontConfig.color
  const fontTag = tag || fontConfig.tag

  const TagName = `${fontTag}`

  return (
    <TagName className={classNames(className, fontSize, fontColor)}>
      {children}
    </TagName>
  )
}

export default Typography
