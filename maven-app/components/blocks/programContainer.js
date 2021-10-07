// import { useState } from 'react'
import { Card, Typography } from '@components'
import { Button } from '@components/form'
import { useRouter } from 'next/router'

const ProgramContainer = ({ programs, loadMore }) => {
  const router = useRouter()

  return (
    <div
      className={`mb-12 ${
        loadMore ? 'lg:mb-20' : 'lg:mb-28'
      } flex flex-col items-center justify-center`}
    >
      <div className="block grid lg:gap-12 gap-8 lg:grid-cols-3 grid-cols-1 pb-4 lg:pb-0 w-full">
        {programs.map((program, index) => {
          return (
            <Card className="px-6 py-10" key={index}>
              <Typography variant="subheading-2" className="mb-4 uppercase">
                {program.name}
              </Typography>
              <Typography color="text-blue-850" className="mb-24 uppercase">
                {program.date} | {program.time}
              </Typography>
              <a href={program.link}>
                <Typography className="underline">View Details</Typography>
              </a>
            </Card>
          )
        })}
      </div>
      {loadMore && (
        <Button
          buttonStyle="gray-outline"
          type="button"
          buttonContent="Load More"
          className="font-bold lg:mt-12 mt-4"
          width="auto"
          action={() => {
            router.push('/individual/my-classes-events')
          }}
        />
      )}
    </div>
  )
}

export default ProgramContainer
