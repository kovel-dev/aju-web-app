import { useState, useEffect } from 'react'
import CardContainer from './cardContainer'
import Pagination from '../../components/pagination'
import Product from '../../lib/models/product'
import Loading from '../../components/loading'
import { Subheading } from 'components'

const ProgramPaginationContainer = ({ programType, title }) => {
  const [activePage, setActivePage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsShown, setItemsShown] = useState([])
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [programsState, setProgramsState] = useState([])
  // variable to toggle loading gif
  const [isLoading, setIsLoading] = useState(true)
  // variable to toggle error message
  const [hasError, setHasError] = useState(false)

  let product = new Product()

  useEffect(async () => {
    setIsLoading(true)
    const type = programType
    await product
      .getAllProductsbyType(type)
      .then((response) => {
        setProgramsState(response.data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setHasError(true)
        setIsLoading(false)
      })
  }, [programType])

  useEffect(() => {
    if (programsState) {
      const newItemsShown = programsState.slice(0, itemsPerPage)
      setItemsShown(newItemsShown)

      const newTotalPages = Math.ceil(programsState.length / itemsPerPage)
      setTotalPages(newTotalPages)
    }
  }, [programsState])

  const updatePage = (newPage) => {
    setActivePage(newPage)
    //post request??

    const newItemsShown = programsState.slice(
      itemsPerPage * (newPage - 1),
      itemsPerPage * newPage
    )
    setItemsShown(newItemsShown)
  }

  return (
    <>
      {isLoading || hasError ? (
        <Loading hasError={hasError} />
      ) : (
        <>
          {title && <Subheading content={title} />}
          <CardContainer schema={itemsShown} />
          <Pagination
            pages={Array.from(Array(totalPages + 1).keys()).slice(1)}
            activePage={activePage}
            updatePageProp={updatePage}
          />
        </>
      )}
    </>
  )
}

export default ProgramPaginationContainer
