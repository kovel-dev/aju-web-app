import { getSession } from 'next-auth/client'
import { useEffect, useState } from 'react'
import { server } from '../../lib/config/server'
import Meta from '../meta'

function Dashboard() {
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   getSession().then((session) => {
  //     if (!session) {
  //       window.location.href = `${server}/`;
  //     } else {
  //       setIsLoading(false);
  //     }
  //   });
  // }, []);

  // if (isLoading) {
  //   return <h1 className="text-center">Loading...</h1>;
  // }
  return (
    <>
      <Meta title="Dashboard | Maven Admin" keywords="" description="" />
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Replace with your content */}
        <div className="py-4">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96"></div>
        </div>
        {/* /End replace */}
      </div>
    </>
  )
}

export default Dashboard
Dashboard.auth = true
