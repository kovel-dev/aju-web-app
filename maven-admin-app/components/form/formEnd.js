import React from 'react'
import Button from './buttons'

const FormEnd = () => {
  return (
    <div className="pt-5">
      <div className="flex justify-end">
        <Button
          type="button"
          buttonStyle="white"
          disabled={false}
          action={(e) => e.preventDefault()}
          buttonContent="Cancel"
        />
        <Button
          type="submit"
          buttonStyle="blue"
          disabled={false}
          action={(e) => e.preventDefault()}
          buttonContent="Submit"
        />
      </div>
    </div>
  )
}

export default FormEnd
