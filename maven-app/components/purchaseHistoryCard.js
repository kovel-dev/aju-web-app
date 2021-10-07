import { Button, Card, Typography } from '@components'

const PurchaseHistoryCard = ({ item, itemIndex }) => {
  return (
    <Card className="mb-12 lg:mb-20 py-7 lg:py-9 lg:px-16 px-7 lg:mx-20 flex flex-col lg:space-y-8 space-y-4">
      <div className="block gap-2 lg:flex lg:justify-between">
        <div className="mb-4 lg:mb-0">
          <Typography className="font-bold">
            <span className="lg:text-lg">
              {item.accountHolderName} you’re attending
            </span>
          </Typography>
        </div>
        <Typography className="mb-3 underline flex-shrink-0">
          <span className="text-base">
            <a href={item.link}>View Details</a>
          </span>
        </Typography>
      </div>
      <div className="block lg:justify-between lg:flex lg:items-center">
        <div className="mb-6 lg:w-1/2 lg:mr-5 lg:mb-0">
          <img
            src={item.image}
            alt="customer suppport image"
            className="object-cover w-full h-auto"
          />
        </div>
        <div className="lg:w-1/2 lg:ml-5 flex flex-col justify-between self-stretch lg:py-4 pb-2">
          <div>
            <Typography variant="subheading" className="lg:mb-3">
              <span className="text-xl lg:text-2xl uppercase">
                {item.program}
              </span>
            </Typography>
            <Typography
              color="text-blue-850"
              className="mb-8 lg:mb-0 text-lg uppercase"
            >
              {item.date}
            </Typography>
          </div>
          {item.sponsor && item.sponsor.length > 0 && (
            <Typography color="text-blue-850">
              <span>SPONSORED BY: </span>
              {item.sponsor
                .map((item, index) => {
                  return item.label
                })
                .join(', ')}
            </Typography>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="hidden lg:inline-block">
          <Typography
            tag="span"
            color="text-blue-850"
            className="mr-1 font-bold "
          >
            <span className="uppercase">Confirmation Number:</span>
          </Typography>
          <Typography tag="span" variant="heading" className="inline-block">
            <span className="text-3xl">{item.confirmationNumber}</span>
          </Typography>
        </div>
        <div className="w-28 lg:pb-0 pb-6">
          <Button
            variant="fit"
            buttonStyle="blue-outline"
            type="button"
            width="full"
            buttonContent="Print"
            className="font-bold"
            action={() => {
              print(itemIndex)
            }}
          />
        </div>
      </div>
    </Card>
  )
}

export default PurchaseHistoryCard
