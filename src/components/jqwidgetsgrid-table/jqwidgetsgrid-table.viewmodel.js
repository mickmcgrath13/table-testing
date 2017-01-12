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
            datafield: i,
            text: "header-" + i,
            pinned: i < 3,
            width: 100
          }
        });
      }
    },
    dataAdapter: {
      get(){
        let tableData = this.attr("tableData"),
            source = {localdata: tableData.attr('rows'), datatype: 'array'},
            dataAdapter = new $.jqx.dataAdapter(source, {
              loadComplete: function (data) {},
              loadError: function (xhr, status, error) {}
            });

        return dataAdapter;
      }
    }
  }
});