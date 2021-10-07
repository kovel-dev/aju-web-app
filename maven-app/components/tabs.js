import { useState, useEffect } from 'react'

const Tabs = ({ tabs, updateTabProp }) => {
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    updateTabProp(activeTab)
  }, [activeTab])

  return (
    <div className="max-w-wrapper mx-auto sm:px-5">
      <div className="sm:border-b-2 sm:border-blue-850 flex">
        {tabs.map((tabItem, index) => {
          return (
            <button
              key={'tab-' + index}
              id={'tab-' + index}
              className={`${
                index === activeTab
                  ? 'bg-blue-850 text-white'
                  : 'text-blue-850 bg-gray-50 hover:opacity-80'
              } px-2 sm:px-9 font-bold ${
                index !== 0 ? 'ml-0 sm:ml-3' : ''
              } tab-btn rounded-b-none w-1/2 sm:w-auto leading-4 h-12 sm:h-auto sm:py-3`}
              onClick={() => {
                setActiveTab(index)
              }}
            >
              {tabItem}
            </button>
          )
        })}
      </div>
    </div>
  )
}
export default Tabs
