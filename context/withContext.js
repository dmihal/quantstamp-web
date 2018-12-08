const withContext = (name, Consumer) => (
  (Wrapped) => (
    (props) => (
      <Consumer>
        {value => (
          <Wrapped {...Object.assign({}, { [name]: value }, props)} />
        )}
      </Consumer>
    )
  )
);

export default withContext;
