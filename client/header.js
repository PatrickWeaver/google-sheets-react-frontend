const Header = function(props) {

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
