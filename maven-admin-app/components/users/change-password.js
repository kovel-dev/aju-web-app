import React, { useState } from 'react'
import { useRouter } from 'next/router'
import User from '../../lib/models/user'

function ChangePassword(props) {
  const router = useRouter()
  const query = router.query
  const userRefNumber = query.id

  const [newPassword, setNewPassword] = useState('')
  const [reqResultStatus, setReqResultStatus] = useState(null)
  const [reqResultmsg, setReqResultmsg] = useState('')

  // const toggleModal = () => {
  //   isModalOpen ? setIsModalOpen(false) : setIsModalOpen(true);
  // };

  const submitHandler = (e) => {
    e.preventDefault()
    const reqResult = makeChangeRequest()

    // (reqResult.success ? setReqResultStatus(true) : setReqResultStatus(false))
    // setReqResultmsg(reqResult.message)
  }

  const makeChangeRequest = async () => {
    const result = await User.changePassword(newPassword, userRefNumber)
    result.success ? setReqResultStatus(true) : setReqResultStatus(false)
    setReqResultmsg(result.message)
  }

  return (
    <>
      {/* {!isModalOpen &&
                <button 
                onClick={toggleModal}
                className={`${props.classes ? props.classes : "w-1/3 px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-black bg-yellow-400 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600"}`}>
                    Change Password
                </button>
            } */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Update Password
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Set a new Password. Min 8 Characters.</p>
          </div>
          <form
            className="mt-5 sm:flex sm:items-center"
            onSubmit={submitHandler}
          >
            <div className="w-full sm:max-w-xs">
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="shadow-sm focus:primary-dark focus:border-primary-dark block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="New password"
              />
            </div>
            <a
              onClick={(e) => submitHandler(e)}
              className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save
            </a>
          </form>
          {reqResultStatus !== null && (
            <div>
              <p
                className={`mt-4 ${
                  reqResultStatus ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {reqResultmsg}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ChangePassword
