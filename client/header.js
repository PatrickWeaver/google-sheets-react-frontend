const Header = function(props) {

  var pages = null;
  if (props.pages.length > 1) { 
    var pages = props.pages.map(page =>   
      <li><h3><Link to={"/" + page.title} onClick={props.menuClick}>{page.title}</Link></h3></li>
    );
  }
  
  return (
      <div id="header">
        <h1>{props.title}</h1>
        <ul id="menu">
          {pages}
        </ul>
      </div>
  ); 
}
