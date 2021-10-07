import AssetManager from '../../components/assets/manager'
import TableView from '../../components/assets/table-view'
import FileUploadInput from '../../components/assets/file-upload-input'

function AssetManagerPage() {
  //return <AssetManager />
  return (
    <>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-3">
        <h1 className="col-span-2 text-2xl font-semibold text-gray-900">
          All Assets
        </h1>
      </div>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Replace with your content */}
        <div className="py-4">
          <TableView showPDF={true} />
        </div>
        {/* /End replace */}
      </div>
    </>
  )
}

export default AssetManagerPage
