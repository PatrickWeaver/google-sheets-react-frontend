const RowList = function(props) {
  
  let rowList = null;
  if (props.row) {

    
    const rowArray = Object.entries(props.row).reduce((accumulator, current) => {
      if (!current[1].image) {
        var item = {key: current[0], value: current[1]}
        accumulator.push(item);
      }  
      return accumulator;
    }, []);
    
    rowList = rowArray.map(item =>
        <li key={item["key"]}><strong>{item.key}:</strong> {item.value}</li>    
     );
  }
  
  return (
    <div class="plant">
      <ul class="facts">
        {rowList}
      </ul>
      <div class="image">
        <img src={props.row["Image"].url} />
      </div>
    </div>   
  )
}


const Content = function(props) {
 
  
  var message;
  if (props.message) {
    message = <h3>{props.message}</h3>;
  }
  
  
  const rows = props.rows.map(row => 
    <RowList row={row} />                        
  );
  
  return (
    <div id="content">
      <h2>{props.title}</h2>
      {message}
      
      {rows}
      

    </div>
  ); 
}