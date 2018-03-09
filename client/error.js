const Error = function(props) {
  if (props.error){
    return (
      <div id="error">

        <h2>Error: {props.error}</h2>

      </div>
    ); 
  } else {
    return (
      <div></div>
    )
  }
}