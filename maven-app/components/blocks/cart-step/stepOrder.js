import React from 'react'
import moment from 'moment'
import SelectInput from '@components/form/selectInput'
import { Heading3, Text } from '@components/partials'
import { hasError, getErrorMessage } from 'lib/validations/validations'

const StepOrder = ({
  productsInCart,
  totalPrice,
  totalCount,
  onUpdateCart,
  onNextStep,
  errors,
}) => {
  const updateCart = (id, value) => {
    onUpdateCart(id, value)
  }

  const proceed = () => {
    onNextStep()
  }

  const getQuantityList = (quantity) => {
    let quantityOptions = []
    for (let index = 1; index <= quantity; index++) {
      quantityOptions.push({ key: index, value: index })
    }

    return quantityOptions
  }

  return (
    <div className="px-5 mx-auto max-w-wrapper">
      <p className="text-base lg:text-xl text-gray-950">
        You have
        <span className="font-bold text-blue-850">
          {' '}
          ({productsInCart.length}) item{' '}
        </span>
        in your cart.
      </p>
      {productsInCart.map((product, productIndex) => (
        <div className="product-items" key={productIndex}>
          <div className="p-4 mt-5 bg-white product-item lg:p-12 shadow-2">
            <div className="flex items-center justify-between pb-5 lg:border-b-2 border-gray-75">
              <div>
                <div className="items-center justify-center block lg:flex">
                  <div className="min-w-product max-w-product">
                    <img
                      src={product.imageUrl}
                      alt="Product image thumbnail"
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-5 ml-0 lg:ml-7 lg:mt-0">
                    <Heading3 heading={product.title} className="mb-5" />
                    <Text
                      text={moment(product.startDt).format(
                        'dddd MMMM DD, YYYY'
                      )}
                      className="mb-2"
                    />
                    {product.sponsorBy.length > 0 && (
                      <Text
                        text={`Sponsored by: ${product.sponsorBy
                          .map((item, index) => {
                            return item.label
                          })
                          .join(', ')}`}
                        className="mb-2"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <Heading3 heading={`$${product.price}`} />
              </div>
            </div>
            {hasError(errors, product.productId) && (
              <div className="justify-center mx-auto max-w-wrapper">
                <p className="text-center text-red-600">
                  {getErrorMessage(errors, product.productId)}
                </p>
              </div>
            )}
            <div className="lg:pt-5">
              <div className="flex items-center justify-start lg:justify-end">
                <SelectInput
                  options={getQuantityList(10)}
                  placeholder="Quantity"
                  width="brand"
                  style={{ width: '160px' }}
                  value={product.quantity}
                  onChange={({ target: { value } }) =>
                    updateCart(product.productId, value)
                  }
                />
                <button
                  className="px-6 h-10 mt-1 sm:mt-0 sm:h-auto sm:py-2 ml-3 text-white bg-red-150 lg:px-11 font-mont hover:opacity-80 text-lg w-40 font-bold"
                  onClick={() => updateCart(product.productId, 0)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="p-4 mt-5 bg-white lg:p-12 shadow-2">
        <Heading3
          heading={
            totalCount > 1
              ? `Subtotal (${totalCount} tickets): $${totalPrice}`
              : `Subtotal (${totalCount} ticket): $${totalPrice}`
          }
          className="lg:text-right text-center"
        />
      </div>
      <div className="mt-5 lg:text-right text-center">
        <button
          className="inline-block px-8 py-3 ml-auto text-white bg-blue-850 font-mont hover:opacity-80 text-lg font-bold"
          onClick={proceed}
        >
          Proceed to {totalPrice > 0 ? 'checkout' : 'register'}
        </button>
      </div>
    </div>
  )
}

export default StepOrder
