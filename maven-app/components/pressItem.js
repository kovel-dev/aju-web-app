import { Button, Typography } from '@components'

const PressItem = ({ item }) => {
  return (
    <div className="flex flex-col pb-12 mb-12 border-b border-gray-400 lg:flex-row">
      <div className="w-full mr-0 lg:mr-6 lg:w-1/3 mb-7 lg:mb-0">
        <img
          src={item.image}
          alt="press image"
          className="object-cover w-full h-auto"
        />
      </div>

      <div className="lg:w-2/3 lg:ml-6">
        <Typography variant="subheading" className="mb-6">
          <div className="text-gray-950 lg:text-blue-850">
            {item.article.title.toUpperCase()}
          </div>
        </Typography>
        <Typography className="mb-4">{item.article.quote}</Typography>
        <Typography className="mb-6">{item.article.content}</Typography>
        <div className="text-center lg:text-left">
          <Button
            type="button"
            buttonContent="Read Full Article"
            action={() => window.open(item.article.link, '_ blank')}
          />
        </div>
      </div>
    </div>
  )
}

export default PressItem
