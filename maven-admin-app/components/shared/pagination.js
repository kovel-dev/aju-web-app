const Pagination = ({ numOfItemsPerPage, onClickPage, totalItems }) => {
  const numOfPages = Math.ceil(totalItems / numOfItemsPerPage)
  let listOfPage = []

  for (let pageNumber = 1; pageNumber <= numOfPages; ++pageNumber) {
    listOfPage.push(
      <li key={pageNumber} style={{ display: 'inline' }}>
        <button onClick={() => onClickPage(pageNumber, numOfItemsPerPage)}>
          {pageNumber}
        </button>
      </li>
    )
  }

  return (
    <div className="flex flex-col items-center mt-5">
      <div className="pagination-btn flex justify-between items-center">
        <ul>{listOfPage}</ul>
      </div>
    </div>
  )
}

export default Pagination
