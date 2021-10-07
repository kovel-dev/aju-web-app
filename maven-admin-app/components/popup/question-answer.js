import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { server } from '../../lib/config/server'
import Loader from '../loader'
import ViewComponent from '../form/view-builder'

const QuestionAnswerPopup = ({ open, closeProp, attendeeRefId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [questionAnswerData, setQuestionAnswerData] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    getQuestionAnswer()
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.getElementById('delete-modal')?.classList.remove('hidden')
      document.getElementById('delete-overlay')?.classList.remove('hidden')
    } else {
      document.getElementById('delete-modal')?.classList.add('hidden')
      document.getElementById('delete-overlay')?.classList.add('hidden')
    }
  }, [isOpen])

  useEffect(() => {
    if (open) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [open])

  const getQuestionAnswer = async () => {
    await axios
      .post(`${server}/api/attendees/get-question-answer-by-ref`, {
        refId: attendeeRefId,
      })
      .then((response) => {
        const data = response.data

        setQuestionAnswerData(data)
        setIsLoading(false)
      })
      .catch(function (err) {
        console.log(err)
        setErrors(err.response.result.data)
        setIsLoading(false)
      })
  }

  return (
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 z-50 hidden w-screen h-screen transition-opacity bg-transparent"
        aria-hidden="true"
        id="delete-overlay"
      >
        <div className="absolute inset-0 z-10 bg-gray-500 opacity-75"></div>
        <div
          className="relative z-40 hidden p-2 mx-auto overflow-hidden text-left bg-white border-2 rounded-sm shadow-xl modal max-w-success sm:top-1/4 top-1/12 top-14 w-9/12"
          id="delete-modal"
        >
          <div className="flex justify-end mb-1 text-2xl font-bold title-bar">
            <button
              onClick={() => {
                setIsOpen(false)
                closeProp(false)
              }}
              className="px-3 py-2 text-sm rounded-sm focus:outline-none bg-blue-850"
            >
              &#10005;
            </button>
          </div>
          <div className="relative block px-1 pb-8 text-center">
            {/* <h3 className="mb-4 text-xl font-bold sm:text-2xl text-blue-850">
              Questions and Answer
            </h3> */}
            {isLoading && (
              <div className="mx-2">
                <Loader />
              </div>
            )}
            {!isLoading && questionAnswerData.length <= 1 && (
              <div className="justify-center mx-auto max-w-wrapper mt-5 mb-5">
                <p className="text-center text-blue-850">
                  No Questions and Answers Found.
                </p>
              </div>
            )}
            {!isLoading && questionAnswerData.length > 1 && (
              <ViewComponent
                name="Questions and Answers"
                messages={questionAnswerData}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default QuestionAnswerPopup
