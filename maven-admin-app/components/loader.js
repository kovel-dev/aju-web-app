function Loader(props) {
  return (
    <div className="max-w-wrapper mx-auto justify-center">
      <img
        src={'/assets/images/loading.gif'}
        alt="loading"
        className="w-12 h-12 mx-auto"
      />
      <p className="text-center">
        {props.message ? props.message : 'Loading...'}
      </p>
    </div>
  )
}

export default Loader
