function ResendEmailVerification(props) {
  return (
    <>
      <div className="bg-white shadow sm:rounded-lg mt-10">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Resend Email Verification
          </h3>
          <a
            onClick={(e) => props.onClickResendEmailVerification(e)}
            className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark sm:w-auto sm:text-sm"
          >
            Resend
          </a>
        </div>
      </div>
    </>
  )
}

export default ResendEmailVerification
