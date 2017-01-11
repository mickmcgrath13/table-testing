var buildRows = function(numColumns, numRows){
  var rows = [], thisRow;
  for(var i = 0; i < numRows; i++){
    thisRow = [];
    for(var j = 0; j < numColumns; j++){
      thisRow.push(j + "-row-" + i);
    }
    rows.push(thisRow);
  }
  return rows;
}

var buildHeaders = function(numColumns){
  var headers = [];
  for(var i = 0; i < numColumns; i++){
    headers.push(i + "-header");
  }
  return headers;
}

var getMockData = function(numColumns, numRows){
  var data = {
        "headers":buildHeaders(numColumns),
        "rows": buildRows(numColumns, numRows),
        "cacheId": 148093,
        "links": [{
          "rel": "self",
          "href": "https://sprintlab125lbwas.netact.nsn-rdnet.net/pmservices/api/v1/reports/results/148093/data"
        }]
      };
  return data;
};

  export default getMockData;
