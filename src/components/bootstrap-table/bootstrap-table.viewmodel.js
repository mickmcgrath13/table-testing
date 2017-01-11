import Map from 'can/map/';
import 'can/map/define/';

export default Map.extend({
  define: {
    tableData: {
      value: {}
    },
    tableHeaders: {
      get(){
        let tableData = this.attr("tableData");
        return tableData.attr("headers").map((h, i) => {
          return {
            id: i,
            field: i,
            title: "header-" + i,
            sortable: true,
            originalData: h
          }
        })
      }
    },
    tableRows: {
      get(){
        let tableData = this.attr("tableData");
        return tableData.attr("rows");
      }
    }
  }
});