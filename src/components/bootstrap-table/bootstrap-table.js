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
import './extensions/bootstrap-table-perfect-scrollbar/';
import './extensions/bootstrap-table-multiple-sort/';
import './extensions/bootstrap-table-fixed-columns/';
import './extensions/bootstrap-table-pagination-events/';
import './extensions/bootstrap-table-refresh-data/';


//We'd probably want to implement our own filter control.  This one is pretty slow.
//import 'bootstrap-table/dist/extensions/filter-control/bootstrap-table-filter-control';

export default Component.extend({
  tag: 'bootstrap-table',
  viewModel: ViewModel,
  template,
  events:{

    //---- CONTROLLER PROPERTIES ----//

    //flag to know whether or not to manually insert/remove items
    //  Initially false because the initialization of the comoponent
    //  will insert all items in the beginning
    manageDataOnChange: false,

    //---- END CONTROLLER PROPERTIES ----//


    //---- INITIALIZATION ----//
    "inserted": function($el, ev){
      this.$el = $(this.element);
      this.$table = this.$el.find("table");
      var performanceMap = this.viewModel.attr("performanceMap");

      performanceMap && performanceMap.setRenderStartTime();
      this.initBootstrapTable();
      performanceMap && performanceMap.setRenderEndTime();

      //set flag for managing incoming data
      this.manageDataOnChange = true;
    },

    initBootstrapTable(){
      let tableData = this.viewModel.attr("tableData");
      let derivedHeaders = this.viewModel.attr("tableHeaders");
      let derivedRows = this.viewModel.attr("tableRows");
      let self = this; //need self because we need the context of some of the callback functions
      this.$table.bootstrapTable({
          columns: derivedHeaders.attr(),
          data: derivedRows.attr ? derivedRows.attr() : derivedRows.attr(),
          pagination: true,
          height: this.$el.height(),
          search: true,
          pageSize: 100,
          multiSortWithWebWorkers: true,

          //http://issues.wenzhixin.net.cn/bootstrap-table/extensions/fixed-columns.html
          fixedColumns: true,
          fixedNumber: 2,

          perfectScrollbar: true,

          multiSort: true,
          // sortPriority: [{sortName: 1, sortOrder: 'asc'}, {sortName: 3, sortOrder: 'desc'}],
          sortPriority: [{sortName: 0, sortOrder: 'desc'}],

          diffProp: 3,

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
          },

          onSortWebworkerLoading: function(){
            self.disableScroll();
          },
          onSortWebworkerLoadingDone: function(){
            self.enableScroll();
          }
      });
    },
    //---- END INITIALIZATION ----//


    //---- EVENTS ----//
    onPageChangeBefore(tablePlugin, num, size){
      var performanceMap = this.viewModel.attr("performanceMap");
      performanceMap && performanceMap.setLastPageStart();
    },

    onPageChange(tablePlugin, num, size){
      var performanceMap = this.viewModel.attr("performanceMap");
      performanceMap && performanceMap.setLastPageEnd();
    },

    onSortAfter(tablePlugin, name, order){
      this.viewModel.attr("isLoading", false);
      var performanceMap = this.viewModel.attr("performanceMap");
      performanceMap && performanceMap.setLastSortEnd();
    },

    onSort(tablePlugin, sortPrioirty){
      this.viewModel.attr("isLoading", true);
      var performanceMap = this.viewModel.attr("performanceMap");
      performanceMap && performanceMap.setLastSortStart();
    },
    //---- END EVENTS ----//


    //---- DATA CHANGING ----//
    "{viewModel} tableRows": function(vm, ev, newVal, oldVal){
      if(this.manageDataOnChange){
        var newRows = newVal.attr ? newVal.attr() : newVal;
        this.onDataChanged(newRows, oldVal);
      }
    },
    onDataChanged(newVal, oldVal){
      this.$table.bootstrapTable("refreshData", newVal);
    },
    //---- END DATA CHANGING ----//


    disableScroll(){
      this.$table.bootstrapTable("disableScroll");
    },
    enableScroll(){
      this.$table.bootstrapTable("enableScroll");
    },

  }
});