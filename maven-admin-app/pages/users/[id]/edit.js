import UserForm from '../../../components/users/user-form'
import { getSession } from 'next-auth/client'
import { server } from '../../../lib/config/server'
import UserFormBuilder from '../../../components/users/user-form-builder'
import ChangePassword from '../../../components/users/change-password'

function CreateUserPage() {
  return (
    <>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-3">
        <h1 className="col-span-2 text-2xl font-semibold text-gray-900">
          Edit User
        </h1>
      </div>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* <FormBuilder /> */}
          <UserFormBuilder edit />
        </div>
        <div className="">
          <ChangePassword />
        </div>
      </div>
    </>
  )
}

export default CreateUserPage
