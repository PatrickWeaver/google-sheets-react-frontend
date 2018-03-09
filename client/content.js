const Content = function(props) {
  const rows = props.rows.map(row => 
    <li>
      <h2>{row["Common Name"]}</h2>
      <h4><em>{row["Scientific Name"]}</em></h4>
    </li>
  );
  
  return (
    <div id="content">
      
      <h2>{props.title}</h2>
      <ul>{rows}</ul>
      

    </div>
  ); 
}