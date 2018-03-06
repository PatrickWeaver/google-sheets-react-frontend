class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Loading . . .",
      worksheets: [],
      rows: []
    }
  }
  /*
  this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  */
  
  componentDidMount() {
    /*
    this.dataRequest = setInterval(
      () => {
        fetch('/json')
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          console.log("SETTING STATE");
          this.setState({
            title: data.title,
            worksheets: data.worksheets,
            rows: data.rows
          });
        }.bind(this))
        .catch(function(error) {
          console.log("ERROR: " + error);
          this.setState({
            error: error
          });
        }.bind(this));
      }, 10000
    );
    */
  }

  componentWillUnmount() {
    /*
    clearInterval(this.dataRequest);
    */
  }
  render() {
    return(
      <div id="app">
        <Header />
        {/*<Error error={this.state.error}/>*/}
        <Content 
          title={this.state.title}
          //worksheets={this.state.worksheets}
          //rows={this.state.rows}
        />
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('main'));