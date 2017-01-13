import Component from 'can/component/';
import './jqgrid-table.less!';
import template from './jqgrid-table.stache!';
import ViewModel from './jqgrid-table.viewmodel';

import 'jquery';
import 'jqGrid/js/jquery.jqGrid';
import 'jqGrid/js/i18n/grid.locale-en';
import 'jqGrid/css/ui.jqgrid.css!';
import 'bootstrap/dist/css/bootstrap.min.css!';
import 'jqGrid/css/ui.jqgrid-bootstrap.css!';

export default Component.extend({
  tag: 'jqgrid-table',
  viewModel: ViewModel,
  events: {
    "inserted": function(){
      this.$el = $(this.element);

      var performanceMap = this.viewModel.attr("performanceMap");

      performanceMap && performanceMap.setRenderStartTime();
      this.initJQGrid();
      performanceMap && performanceMap.setRenderEndTime();
      
    },
    isChangingPage: false,
    initJQGrid(){
      let columns = this.viewModel.attr("tableColumns"),
          // jqgrid must be an array. Object.values on can.Map includes length & _cid :/
          data = Array.from(this.viewModel.attr("tableData.rows"));

      $.jgrid.defaults.styleUI = 'Bootstrap';

      this.$el.find('#jqgrid').jqGrid({
        autosize: false,
        shrinkToFit: false,
        datatype: 'local',
        data,
        height: 320,
        width: 348,
        colModel: columns,
        // column sorting doesn't work when combined with "frozen" columns :/
        multiSort: true,
        pager: "#jqgrid-pager",
        // adding row counts to the pager pushes the pager buttons out of view :/
        //viewrecords: true,
        regional: 'en',
        rowNum: 100,
        onPaging: (pagingType, targetEl) => {
          this.onPageChangeBefore();
        },
        gridComplete: () => {
          this.onPageChange();
        }

      }).jqGrid("setFrozenColumns");
    },

    onPageChangeBefore(){
      this.isChangingPage = true;
      var performanceMap = this.viewModel.attr("performanceMap");
      performanceMap && performanceMap.setLastPageStart();
    },

    onPageChange(){
      if(this.isChangingPage){
        this.isChangingPage = false;
        var performanceMap = this.viewModel.attr("performanceMap");
        performanceMap && performanceMap.setLastPageEnd();
      }
    }
  },
  template
});