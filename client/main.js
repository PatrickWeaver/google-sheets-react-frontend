// * * * * * * * * * * * * * * * * * * * 
// SETTINGS:
// * * * * * * * * * * * * * * * * * * * 

// spreadsheet key is the long id in the sheets URL (after "/d/").
// https://docs.google.com/spreadsheets/d/1C7Ojs1i8duxWBmBYPtMTDVLRF7mu-WMTEjKi1-xCuE8/edit#gid=707399917
//                                        ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^  
const SPREADSHEET_KEY             = "18maXAoXx2j32CcCXEpAPrDveQkrKibBEs22JwwGrFYs";

const DEFAULT_TAB                 = 0; // Could also use the name of a tab like "Trees", or null for no default and just links

const INCLUDE_TIMESTAMP           = false;

const FAVICON_URL                 = "https://cdn.glitch.com/1a9a5bfd-9c7e-47f9-8b2e-3153269e66dd%2Freactpage.png?1520790419986";

var favicon = document.querySelector("#favicon");
favicon.setAttribute("href", FAVICON_URL);

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
    document.title = "";

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
      title: "",
      worksheets: [],
      rows: [],
      message: "Loading . . ."
    }
  }

  componentDidMount() {
    this.getData();
   
    this.dataRequest = setInterval(
      () => {
        this.getData();
      }, 5000
    );
    
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
        var title = data.title;
        if (title.length >= 11) {
          var endIndex = title.length;
          var startIndex = endIndex - 11;
          if(title.substr(startIndex, endIndex) === "(Responses)") {
            data.title = data.title.substr(0, startIndex); 
          };
          console.log(data.title);
        }
        this.setState({
          title: data.title
        });
        data.worksheets[index].current = true;
        var currentTitle = data.worksheets[index].title;
        if (
          currentTitle.substr(0, 14) != "Form Responses"
          &&
          currentTitle.substr(0, 22) != "Copy of Form Responses"
        ) {
          data.currentWorksheet = data.worksheets[index].title;
        } else {
          data.currentWorksheet = "";
        }
        rows = newData;
        if (data.worksheets.length === 1) {
          data.worksheets[index].only = true; 
        } else {
          data.worksheets[index].only = false; 
        }
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
          if (!this.INCLUDE_TIMESTAMP && prop != "timestamp"){
            if (row[prop] && typeof row[prop] === "string" && row[prop].substring(0, 4) === "http") {
              row[prop] = linkOrImage(row[prop]); 
            }
            if (row[prop]) {
              newRow[header] = row[prop];
            }
          }
        }
        data.rows.push(newRow);
      }
      document.title = data.title;
      this.setState({
        currentWorksheet: data.currentWorksheet,
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
    clearInterval(this.dataRequest);
  }
  
  render() {
    return(
      <div id="app">
        <Error error={this.state.error} />
        <Header
          pages={this.state.worksheets}
          title={this.state.title}
        />
        <Content
          title={this.state.currentWorksheet}
          message={this.state.message}
          worksheets={this.state.worksheets}
          rows={this.state.rows}
        />
    </div>
    );
 }
}

ReactDOM.render(<HashRouter><App /></HashRouter>, document.getElementById('main'));