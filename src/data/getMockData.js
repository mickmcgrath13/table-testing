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
        "cacheId": "0000",
        "links": [{
          "rel": "self",
          "href": "https://google.com"
        }]
      };

  data["headers"] = buildHeaders(numColumns);
  data["rows"] = buildRows(numColumns, numRows);

  return data;
};

  export default getMockData;
