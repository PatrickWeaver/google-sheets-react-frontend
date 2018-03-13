function linkOrImage(url) {
  var imageExts = ["gif", "jpg", "jpeg", "png", "bmp", "svg"];
  var ext = url.split(".").pop().split("?")[0];
  if (imageExts.indexOf(ext.toLowerCase()) >= 0) {
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



function getInfo(SPREADSHEET_KEY) {
  var doc = new GoogleSpreadsheet(SPREADSHEET_KEY);
  return new Promise(function(resolve, reject) {
    doc.getInfo(function(err, sheetData) {
      if (err) {
        console.log(err);
        reject({error: err});
      } else {
        resolve(sheetData);
      }
    });
  });
}

function getData(tab, setData) {
  var data;
  var rows;
  var worksheet;
  var index = -1;
  var title = "";
  getInfo(SPREADSHEET_KEY)
  .then(info => {
    data = info;
    var worksheets = [];
    var staticWorksheet = {};
    for (var i in data.worksheets) {
      if (data.worksheets[i].title != "STATIC") {
        worksheets.push(data.worksheets[i]); 
      } else {
        staticWorksheet = data.worksheets[i];
      }
    }                 
    data.worksheets = worksheets;
    data.staticWorksheet = staticWorksheet;
    
    if (tab === null) {
      return {}; 
    }  
    if (isNaN(tab)) {
      title = tab;
      index = findSheetIndex(title, info);
    } else {
      index = parseInt(tab);
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
      // Once the second set of data comes back you can set the header title
      setData({title: data.title});

      data.worksheets[index].current = true;
      data.currentWorksheet = {};
      var currentTitle = data.worksheets[index].title;
      if (
        currentTitle.substr(0, 14) != "Form Responses"
        &&
        currentTitle.substr(0, 22) != "Copy of Form Responses"
      ) {
        data.currentWorksheet.title = data.worksheets[index].title;
      } else {
        data.currentWorksheet.title = "";
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
        if (INCLUDE_TIMESTAMP || prop != "timestamp"){
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
    if (data.staticWorksheet) {
      return getSheet(data.staticWorksheet);
    } else {
      return {}
    }
  })
  .then(function(staticData) {
    for (var i in staticData[0]) {
      if (i === data.currentWorksheet.title.replace(/[^a-zA-Z0-9.-]/g, '').toLowerCase()) {
        data.currentWorksheet.staticHTML = staticData[0][i];
      }
    }
    document.title = data.title;
    var newData = {
      currentWorksheet: data.currentWorksheet,
      rows: data.rows,
      worksheets: data.worksheets,
      message: ""
    }
    setData(newData);
    return
  })
  .catch(error => {
    setData({
      error: JSON.stringify(error.error)
    });
  });  
}