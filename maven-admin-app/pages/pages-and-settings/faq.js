import React from 'react'
import { useRouter } from 'next/router'
import Form from '../../components/pages-settings/formik-form-builder'
import PageModel from '../../lib/models/pages'
import FaqpageModel from '../../lib/models/pages/faq'
import axios from 'axios'
import { server } from '../../lib/config/server'

export async function getServerSideProps(context) {
  let page = new FaqpageModel({})
  let pageModel = new PageModel()

  //Step 1 : Fetch Initial Values from db
  let initialValues = await pageModel.getPagesData('faq')

  //If no values found, grab default values from model
  if (!initialValues) {
    initialValues = page.fieldValueObj
  }

  return {
    props: { initialValues }, // will be passed to the page component as props
  }
}

function FaqPageEdit({ initialValues }) {
  const page = new FaqpageModel({})

  //Step 2: Get Validation schema
  const validationSchema = page.formValidationSchema

  //Step 3: Get Form schema
  const formSchema = page.formSchema

  //Set PageKey
  const pageKey = 'faq'

  return (
    <>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-3">
        <h1 className="col-span-2 text-2xl font-semibold text-gray-900 capitalize">
          Edit Faq Page
        </h1>
      </div>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <Form
            initialValues={initialValues}
            validationSchema={validationSchema}
            formSchema={formSchema}
            pageKey={pageKey}
          />
        </div>
      </div>
    </>
  )
}

export default FaqPageEdit
