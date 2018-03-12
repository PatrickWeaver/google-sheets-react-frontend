// * * * * * * * * * * * * * * * * * * * 
// SETTINGS:
// * * * * * * * * * * * * * * * * * * * 

const SPREADSHEET_URL            = "https://docs.google.com/spreadsheets/d/1C7Ojs1i8duxWBmBYPtMTDVLRF7mu-WMTEjKi1-xCuE8/edit";
// This is the url of your spreadsheet. Note it has to be "published to the web" (DIFFERENT THAN SHARED PUBLIC ANYONE WITH THE LINK).

const DEFAULT_TAB                 = 0;
// Could also use the name of a tab like "Trees", or null for no default and just links

const INCLUDE_TIMESTAMP           = false;
// Google Forms make a column called "Timestamp" by default, setting this to false means do not include that column in the website.

const FAVICON_URL                 = "https://cdn.glitch.com/1a9a5bfd-9c7e-47f9-8b2e-3153269e66dd%2Freactpage.png?1520790419986";

const AUTO_UPDATE                 = true;
const UPDATE_INTERVAL             = 5; // Seconds

const LOADING_MESSAGE             = "Loading . . .";

// * * * * * * * * * * * * * * * * * * * 
// END SETTINGS
// * * * * * * * * * * * * * * * * * * *

const SPREADSHEET_KEY = SPREADSHEET_URL.substr(39, SPREADSHEET_URL.length).split("/")[0];

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

const earths = ["https://cdn.glitch.com/1a9a5bfd-9c7e-47f9-8b2e-3153269e66dd%2Fearth1.png?1520881013379", "https://cdn.glitch.com/1a9a5bfd-9c7e-47f9-8b2e-3153269e66dd%2Fearth2.png?1520881013257", "https://cdn.glitch.com/1a9a5bfd-9c7e-47f9-8b2e-3153269e66dd%2Fearth3.png?1520881013134"];



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

class SheetView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      tab: this.props.tab ? this.props.tab : DEFAULT_TAB,
      title: "",
      worksheets: [],
      rows: [],
      message: LOADING_MESSAGE
    }
  }

  componentDidMount() {
    getData(this.state.tab, this.setData);
    if (AUTO_UPDATE){
      this.dataRequest = setInterval(
        () => {
          getData(this.state.tab, this.setData);
        }, UPDATE_INTERVAL * 1000
      );
    }
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({
      tab: nextProps.tab
    });
    getData(this.state.tab, this.setData);
  }
  
  componentWillUnmount() {
    if (AUTO_UPDATE){
      clearInterval(this.dataRequest);
    }
  }
  
  menuClick = () => {
    this.setState({
      message: LOADING_MESSAGE
    });
  }
  
  setTitle = (newTitle) => {
    this.setState({
      title: newTitle
    });
  }
  
  setData = (newData) => {
    this.setState(newData); 
  }

  
  render() {
    return(
      <div id="app">
        <Error error={this.state.error} />
        <Header
          pages={this.state.worksheets}
          menuClick={this.menuClick}
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