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
              originalData: h,
              width: i == 0 ? 193 : 110
            };

          if(h instanceof Map){
            var n = h.attr("name");
            if(n){
              objOut.title=n;
            }

            switch (h.type) {
              case 'TIME':
                objOut.formatter = function(value) {
                  value = new Date(value);
                  return value.toLocaleDateString() + " " + value.toLocaleTimeString();
                };
                break;
              case 'KPI':
                objOut.formatter = function(value) {
                  return value ? value.toFixed(2) : value;
                };
                break;
            }
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