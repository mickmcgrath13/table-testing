import Component from 'can/component/';
import './bootstrap-table.less!';
import template from './bootstrap-table.stache!';
import ViewModel from './bootstrap-table.viewmodel';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css!';
import 'bootstrap-table/dist/bootstrap-table.min.css!';
import './extensions/bootstrap-table-fixed-columns/bootstrap-table-fixed-columns.css!';
import 'bootstrap/dist/js/bootstrap.min';
import 'bootstrap-table/dist/bootstrap-table';
import './extensions/bootstrap-table-fixed-columns/';


//We'd probably want to implement our own filter control.  This one is pretty slow.
//import 'bootstrap-table/dist/extensions/filter-control/bootstrap-table-filter-control';

export default Component.extend({
  tag: 'bootstrap-table',
  viewModel: ViewModel,
  template,
  events:{
    "inserted": function($el, ev){
      this.$el = $(this.element);
      this.$table = this.$el.find("table");
      this.initBootstrapTable();
    },

    initBootstrapTable(){
      let tableData = this.viewModel.attr("tableData");
      let derivedHeaders = this.viewModel.attr("tableHeaders");
      let derivedRows = this.viewModel.attr("tableRows");

      this.$table.bootstrapTable({
          columns: derivedHeaders.attr(),
          data: derivedRows.attr(),
          pagination: true,
          height: this.$el.height(),
          search: true,

          //http://issues.wenzhixin.net.cn/bootstrap-table/extensions/fixed-columns.html
          fixedColumns: true,
          fixedNumber: 2
      });
    }
  }
});