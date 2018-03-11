const Header = function(props) {
  
  const pages = props.pages.map(page => 
    <li><h3><a href={"/" + page.title}>{page.title}</a></h3></li>                       
  );
  
  
  return (
    <div id="header">
      <h1>Google Sheets App: React Website</h1>
      <ul id="menu">
        {pages}
      </ul>
    </div>
  ); 
}