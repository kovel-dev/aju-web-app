import React from 'react'
import { useRouter } from 'next/router'

function FormActionButtons(props) {
  const router = useRouter()

  return (
    <>
      <div className="pt-5" key={props.submitLabel}>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
          >
            {props.submitLabel}
          </button>
        </div>
      </div>
    </>
  )
}

export default FormActionButtons
