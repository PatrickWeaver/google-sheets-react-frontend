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

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: this.props.message
    }
  }
  
  componentDidMount() {
    this.loading(0);
  }
  
  componentWillReceiveProps(nextProps) {
    this.loading(0);
    this.setState({
      message: nextProps.message
    });
  }
  
  componentWillUnmount() {

  }
  
  loading(state) {
    var g = document.querySelector("#loading-gif");
    if (this.state.message != "") {
      g.setAttribute("src", earths[state]);
      setTimeout(() => this.loading((state + 1) % 3), 200);
    }
  };
  
  render() {
    if (this.state.message) {
      return (
        <div id="message">
          <h2>{this.state.message}</h2>
          <img id="loading-gif" src={earths[2]} />
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }

}


const Content = function(props) {
  
  const rows = props.rows.map(row => 
    <RowList row={row} />                        
  );
  
  return (
    <div id="content">
      <h2>{props.title}</h2>
      {/*<div id="static-html" dangerouslySetInnerHTML={{__html: props.staticHTML}}></div>*/}
        
      
      <Message message={props.message}/>
      
      {rows}
      

    </div>
  ); 
}