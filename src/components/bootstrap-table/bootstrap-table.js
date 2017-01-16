import Component from 'can/component/';
import './bootstrap-table.less!';
import template from './bootstrap-table.stache!';
import ViewModel from './bootstrap-table.viewmodel';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css!';
import 'bootstrap-table/dist/bootstrap-table.min.css!';
import './extensions/bootstrap-table-fixed-columns/bootstrap-table-fixed-columns.css!';
import 'bootstrap/dist/js/bootstrap.min';
import 'bootstrap-table/src/bootstrap-table';
import 'bootstrap-table/src/extensions/multiple-sort/bootstrap-table-multiple-sort'
import './extensions/bootstrap-table-fixed-columns/';
import './extensions/bootstrap-table-perfect-scrollbar/';
import './extensions/bootstrap-table-pagination-events/';


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
      var performanceMap = this.viewModel.attr("performanceMap");

      performanceMap && performanceMap.setRenderStartTime();
      this.initBootstrapTable();
      performanceMap && performanceMap.setRenderEndTime();
    },

    initBootstrapTable(){
      let tableData = this.viewModel.attr("tableData");
      let derivedHeaders = this.viewModel.attr("tableHeaders");
      let derivedRows = this.viewModel.attr("tableRows");
      let self = this; //need self because we need the context of some of the callback functions
      this.$table.bootstrapTable({
          columns: derivedHeaders.attr(),
          data: derivedRows.attr(),
          pagination: true,
          height: this.$el.height(),
          search: true,

          //http://issues.wenzhixin.net.cn/bootstrap-table/extensions/fixed-columns.html
          fixedColumns: true,
          fixedNumber: 2,

          perfectScrollbar: true,

          showMultiSort: true,

          onPageChange: function(num, size){
            self.onPageChange(this, num, size);
          },
          onPageChangeBefore: function(num, size){
            self.onPageChangeBefore(this, num, size);
          },

          onSort: function(name, order){
            self.onSort(this, name, order);
          },
          onSortAfter: function(name, order){
            self.onSortAfter(this, name, order);
          }
      });
    },
    
    onPageChangeBefore(tablePlugin, num, size){
      var performanceMap = this.viewModel.attr("performanceMap");
      performanceMap && performanceMap.setLastPageStart();
    },

    onPageChange(tablePlugin, num, size){
      var performanceMap = this.viewModel.attr("performanceMap");
      performanceMap && performanceMap.setLastPageEnd();
    },

    onSortAfter(tablePlugin, name, order){
      var performanceMap = this.viewModel.attr("performanceMap");
      performanceMap && performanceMap.setLastSortEnd();
    },

    onSort(tablePlugin, name, order){
      var performanceMap = this.viewModel.attr("performanceMap");
      performanceMap && performanceMap.setLastSortStart();
    }
  }
});