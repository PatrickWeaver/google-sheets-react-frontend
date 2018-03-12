const RowList = function(props) {
  
  let rowList = null;
  let imageList = null;
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
    
    
    const imageArray = Object.entries(props.row).reduce((accumulator, current) => {
      if (current[1].image) {
        var image = current[1].url;
        accumulator.push(image);
      }
      return accumulator;
    }, []);
    
    imageList = imageArray.map(image =>
      <div class="image"><img src={image} /></div>
    );
    
  }
  
  return (
    <div class="plant">
      <ul class="facts">
        {rowList}
      </ul>
      <div class="images">
        {imageList}
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