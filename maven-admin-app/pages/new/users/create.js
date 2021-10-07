import { getSession } from 'next-auth/client'
import { server } from '../../../lib/config/server'
// import AddUserForm from "../../../components/users/add-user-form";
import FormTemplate from '../../../components/form/formTemplate'

function CreateUserPage() {
  return (
    <>
      {/* <AddUserForm /> */}
      {/* <FormTemplate
        schema={
          [
            {
              type: "heading",
              heading: "Create New User",
              description: "Fill out the form below to create a new user."
            },
            {
              type: "text",
              label: "First name",
              id: "first_name",
              name: "first_name",
              autoComplete: "given-name",
              placeholder: "",
              disabled: false,
              required: true,
              width: "sm",
            },
            {
              type: "text",
              label: "Last name",
              id: "last_name",
              name: "last_name",
              autoComplete: "",
              placeholder: "",
              disabled: false,
              required: true,
              width: "sm",
            },
            {
              type: "email",
              label: "Email",
              id: "email",
              name: "email",
              autoComplete: "",
              placeholder: "",
              disabled: false,
              required: true,
              width: "sm",
            },
            {
              type: "password",
              label: "Password",
              id: "password",
              name: "password",
              autoComplete: "",
              placeholder: "",
              disabled: false,
              required: true,
              width: "sm",
            },
            {
              type: "select",
              label: "Role",
              id: "role",
              name: "role",
              placeholder: "Select a role",
              options: ["Developer", "Admin", "Staff"]
            },
            {
              type: "textarea",
              label: "Messages",
              id: "messages",
              instructions: "Write your message.",
              name: "messages",
              autoComplete: "",
              placeholder: "",
              disabled: false,
              required: true,
              rows: 3
            },
            {
              type: "radio",
              label: "Push Notifications",
              name: "notifications",
              description: "Choose your option",
              options: ["Everything", "Same as email", "No push notifications"]
            },
            {
              type: "checkbox",
              label: "Choose your options",
              options: ["Perfect", "Terrible", "Could be better"]
            }
          ]
        }
      /> */}
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })

  if (!session) {
    return {
      redirect: {
        destination: `${server}/sign-in`,
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}

export default CreateUserPage
