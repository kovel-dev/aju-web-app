import AccordionElement from './accordionElement'
import { Typography } from '@components'

const Accordion = ({ title, items }) => {
  return (
    <div className="mb-12 text-left">
      <div className="pb-3 border-b border-gray-400">
        <Typography variant="subheading-2">{title}</Typography>
      </div>
      {items.map((item, itemIndex) => (
        <AccordionElement
          title={item.title}
          content={item.content}
          key={itemIndex}
        />
      ))}
    </div>
  )
}

export default Accordion
