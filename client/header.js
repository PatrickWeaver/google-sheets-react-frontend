const Header = function(props) {
  /*
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
  
  
  
  
  */
  var pages = null;
  if (props.pages.length > 1) { 
    var pages = props.pages.map(page =>   
      <li><h3><Link to={"/" + page.title}>{page.title}</Link></h3></li>
    );
  }
  
  return (
      <div id="header">
        <h1>Google Sheets App: React Website</h1>
        <ul id="menu">
          {pages}
        </ul>
      </div>
  ); 
}
