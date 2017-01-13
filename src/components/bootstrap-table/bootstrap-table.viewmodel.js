import Map from 'can/map/';
import 'can/map/define/';
import PerformanceMap from 'table-testing/util/performance-map';

export default Map.extend({
  define: {
    tableData: {
      value: {}
    },
    tableHeaders: {
      get(){
        let tableData = this.attr("tableData");
        return tableData.attr("headers").map((h, i) => {
          var objOut = {
              id: i,
              field: i,
              title: "header-" + i,
              sortable: true,
              originalData: h
            };

          if(h instanceof Map){
            var n = h.attr("name");
            if(n){
              objOut.title=n;
            }

            //TODO: check type and add formatting
          }
          return objOut;
        })
      }
    },
    tableRows: {
      get(){
        let tableData = this.attr("tableData");
        return tableData.attr("rows");
      }
    },
    performanceMap:{
      value: new PerformanceMap()
    }
  }
});