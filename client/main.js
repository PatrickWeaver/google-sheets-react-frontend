// * * * * * * * * * * * * * * * * * * * 
// SETTINGS:
// * * * * * * * * * * * * * * * * * * * 

// spreadsheet key is the long id in the sheets URL (after "/d/").
// https://docs.google.com/spreadsheets/d/1C7Ojs1i8duxWBmBYPtMTDVLRF7mu-WMTEjKi1-xCuE8/edit#gid=707399917
//                                        ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^  
const SPREADSHEET_KEY             = "1C7Ojs1i8duxWBmBYPtMTDVLRF7mu-WMTEjKi1-xCuE8";

const DEFAULT_TAB                 = 0; // Could also use the name of a tab like "Trees", or null for no default and just links

const SITE_TITLE                  = "Plants"

// This won't show up in the JSON API but there needs to be a value (even an empty string).
const FAVICON_URL                 = "";

var GoogleSpreadsheet = window.GoogleSpreadsheet;

const {
  HashRouter,
  BrowserRouter,
  Switch,
  Route,
  Link
} = ReactRouterDOM







class App extends React.Component {
  constructor(props) {
    super(props);
    document.title = SITE_TITLE;

  }

  

  render() {
    return(
      <div>
        <Switch>
          <Route exact path='/' component={SheetView} />
          <Route path="/:sheet" render={(props) => (
            <SheetView tab={props.match.params.sheet} />
          )} />
        </Switch>
      </div>
    );
 }
  

  
}

const View1 = function(props) {  
  return (
    <div>View 1 content</div>
  );
}


class SheetView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      tab: this.props.tab ? this.props.tab : DEFAULT_TAB,
      title: SITE_TITLE,
      worksheets: [],
      rows: [],
      message: "Loading . . ."
    }
  }
  
  /*
  this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  */
  
  componentDidMount() {
    this.getData();

    
    
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
  
  componentWillReceiveProps(nextProps) {
    this.setState({
      tab: nextProps.tab
    });
    this.getData();
  }
  
  getData() {
    var data;
    var rows;
    var worksheet;
    var index = -1;
    var title = "";
    getInfo(SPREADSHEET_KEY)
    .then(info => {
      this.setState({
        title: info.title
      });
      data = info;
      if (this.state.tab === null) {
        return {}; 
      }  
      if (isNaN(this.state.tab)) {
        title = this.state.tab;
        index = findSheetIndex(title, info);
      } else {
        index = parseInt(this.state.tab);
      }
      if (index < 0) {
        throw({error: "Worksheet not found"});
      }
      worksheet = info.worksheets[index]
      return getSheet(worksheet);
    })
    .then(newData => {
      if (index > -1) {
        data.worksheets[index].current = true;
        data.currentWorksheet = data.worksheets[index].title;
        rows = newData;
      }
      return getHeaders(worksheet, Object.keys(rows[0]).length);
    })
    .then(headers => {
      data.rows = [];
      for (var i in rows) {
        var newRow = {};
        var row = rows[i]
        for (var j in headers) {
          var header = headers[j]._value;
          var prop = header.replace(/[^a-zA-Z0-9.-]/g, '').toLowerCase();
          if (row[prop] && typeof row[prop] === "string" && row[prop].substring(0, 4) === "http") {
            row[prop] = linkOrImage(row[prop]); 
          }
          if (row[prop]) {
            newRow[header] = row[prop];
          }
        }
        data.rows.push(newRow);
      }
      
      this.setState({
        rows: data.rows,
        worksheets: data.worksheets,
        message: ""
      });
      return
    })
    .catch(error => {
      this.setState({
        error: String(error.error)
      });
    }); 
    
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
        <Header pages={this.state.worksheets} />
        <Content
          title={this.state.title}
          message={this.state.message}
          worksheets={this.state.worksheets}
          rows={this.state.rows}
        />
    </div>
    );
 }
}

ReactDOM.render(<HashRouter><App /></HashRouter>, document.getElementById('main'));