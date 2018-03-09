

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


function linkOrImage(url) {
  var imageExts = ["gif", "jpg", "jpeg", "png", "bmp", "svg"];
  var ext = url.split(".").pop().split("?")[0];
  if (imageExts.indexOf(ext) >= 0) {
    return {
      image: true,
      hyperlink: false,
      url: url
    }
  } else {
    return {
      image: false,
      hyperlink: true,
      url: url
    }
  }
}

function findSheetIndex (title, info) {
  var index = -1;
  if (title != "") {
    for (var w in info.worksheets) {
      if (info.worksheets[w].title === title) {
        index = w;
        break;
      }
    }    
  } else {
    return -1;
  }
  return index; 
}

function getHeaders(worksheet, cols) {
  return new Promise(function(resolve, reject) {
    worksheet.getCells({
      "min-row": 1,
      "max-row": 1,
      "min-col": 1,
      "max-col": cols,
      "return-empty": true,
    }, function(err, headers) {
      if (err) {
        reject(err);
      }
      resolve(headers);
    });
  });
}

function getSheet(worksheet) {
  return new Promise(function(resolve, reject) { 
    worksheet.getRows({}, function(err, sheetData) {
      if (err) {
        reject(err);
      }
      resolve(sheetData); 
    });
  });
};



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
      tab: DEFAULT_TAB,
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
    var data;
    var rows;
    var worksheet;
    var index = -1;
    var title = "";
    getInfo(SPREADSHEET_KEY, API_URL)
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
        rows: data.rows
      });
      return
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