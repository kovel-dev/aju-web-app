import UserFormBuilder from '../../components/users/user-form-builder'

function CreateUserPage() {
  return (
    <>
      <div className="grid grid-cols-3 px-4 mx-auto max-w-8xl sm:px-6 md:px-8">
        <h1 className="col-span-2 text-2xl font-semibold text-gray-900">
          Create New User
        </h1>
      </div>
      <div className="px-4 mx-auto max-w-8xl sm:px-6 md:px-8">
        <div className="py-4">
          <UserFormBuilder />
        </div>
      </div>
    </>
  )
}

export default CreateUserPage
