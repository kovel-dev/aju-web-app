import { getSession } from 'next-auth/client'
import { server } from '../../lib/config/server'
import QuestionForm from '../../components/questions/question-form'
import QuestionFormBuilder from '../../components/questions/question-form-builder'

function QuestionFormPage() {
  //return <QuestionForm />
  return (
    <>
      <div className="grid grid-cols-3 px-4 mx-auto max-w-8xl sm:px-6 md:px-8">
        <h1 className="col-span-2 text-2xl font-semibold text-gray-900">
          Create New Question
        </h1>
      </div>
      <div className="px-4 mx-auto max-w-8xl sm:px-6 md:px-8">
        <div className="py-4">
          {/* <FormBuilder /> */}
          <QuestionFormBuilder />
        </div>
      </div>
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

export default QuestionFormPage
