import { Button, Card, Typography } from '@components'
import classNames from 'classnames'

const MarketingMaterialCard = ({
  item,
  className: wrapperStyle,
  onClickMaterialButton,
}) => {
  return (
    <Card
      className={classNames(
        'block lg:flex lg:items-center lg:justify-between py-10 lg:py-12 px-6 lg:px-14',
        wrapperStyle
      )}
    >
      <div className="">
        <Typography variant="subheading-2" className="mb-2">
          {item.program}
        </Typography>
        <Typography color="text-blue-850" className="mb-12 lg:mb-0">
          {item.date}
        </Typography>
      </div>
      <div className="text-center">
        <Button
          buttonStyle="blue-outline"
          className="font-bold"
          type="button"
          buttonContent="See Materials"
          action={() => {
            onClickMaterialButton(item.id)
          }}
        />
      </div>
    </Card>
  )
}

export default MarketingMaterialCard
