import Map from 'can/map/';
import 'can/map/define/';

export default Map.extend({
  define: {
    tableData: {
      value: {}
    },
    tableColumns: {
      get(){
        let tableData = this.attr("tableData");
        return tableData.attr("headers").map((h, i) => {
          return {
            name: i,
            label: "header-" + i,
            width: 100,
            frozen: i < 2
          }
        });
      }
    }
  }
});