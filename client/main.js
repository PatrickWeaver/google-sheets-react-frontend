

// * * * * * * * * * * * * * * * * * * * 
// SETTINGS:
// * * * * * * * * * * * * * * * * * * * 

// spreadsheet key is the long id in the sheets URL (after "/d/").
// https://docs.google.com/spreadsheets/d/1C7Ojs1i8duxWBmBYPtMTDVLRF7mu-WMTEjKi1-xCuE8/edit#gid=707399917
//                                        ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^  
const SPREADSHEET_KEY             = "1C7Ojs1i8duxWBmBYPtMTDVLRF7mu-WMTEjKi1-xCuE8";

const DEFAULT_TAB                 = 0; // Could also use the name of a tab like "Trees", or null for no default and just links

const API_URL                     = "https://google-sheet-json-api.glitch.me/";

const SITE_TITLE                  = "Plants"

// This won't show up in the JSON API but there needs to be a value (even an empty string).
const FAVICON_URL                 = "";

var GoogleSpreadsheet = window.GoogleSpreadsheet;

function getInfo(SPREADSHEET_KEY, API_URL) {
  var doc = new GoogleSpreadsheet(SPREADSHEET_KEY);
  return new Promise(function(resolve, reject) {
    doc.getInfo(function(err, sheetData) {
      if (err) {
        console.log(err);
        reject({error: err});
      } else {
        if (sheetData.worksheets) {
          for (var i in sheetData.worksheets) {
             sheetData.worksheets[i].apiURL = API_URL + sheetData.worksheets[i].title;
          }
        }
        resolve(sheetData);
      }
    });
  });
}




class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
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
    getInfo(SPREADSHEET_KEY, API_URL)
    .then(data => {
      this.setState({
        title: data.title
      });
    })
    .catch(error => {
      this.setState({
        error: String(error.error)
      });
    });
    
    
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
        <Error error={this.state.error} />
        <Header />
        <Content
          title={this.state.title}
          worksheets={this.state.worksheets}
          rows={this.state.rows}
        />
    </div>
    );
 }
  
}

ReactDOM.render(<App/>, document.getElementById('main'));