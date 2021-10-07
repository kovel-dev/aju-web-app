import React from 'react'
import classNames from 'classnames'

import { Typography } from '@components'

const Step = ({
  className: wrapperStyle,
  currentStep,
  stepNames,
  children,
}) => {
  return (
    <>
      <div className={classNames('w-full py-6 no-printme', wrapperStyle)}>
        <div className="flex justify-center">
          {stepNames.map((stepName, step) => (
            <div key={step} className="w-full step-progressbar">
              <div className="relative mb-2">
                {step !== 0 && (
                  <div
                    className="absolute z-0 flex items-center w-full"
                    style={{
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div
                      className={classNames(
                        'items-center flex-1 w-full py-1 align-middle  rounded align-center',
                        currentStep <= step ? 'bg-gray-50' : 'bg-blue-850'
                      )}
                    />
                  </div>
                )}
                <Typography>
                  <div
                    className={classNames(
                      'relative flex items-center w-9 lg:w-14 h-9 lg:h-14 mx-auto text-white',
                      currentStep <= step
                        ? 'bg-gray-50 text-blue-850'
                        : 'bg-blue-850 text-white'
                    )}
                    style={{ zIndex: 1 }}
                  >
                    <span className="w-full font-bold text-center">
                      {step + 1}
                    </span>
                  </div>
                </Typography>
              </div>
              <Typography>
                <div
                  className={classNames(
                    'text-center mx-2',
                    currentStep > step && 'font-bold'
                  )}
                >
                  {stepName}
                </div>
              </Typography>
            </div>
          ))}
        </div>
      </div>
      {children}
    </>
  )
}

export default Step
