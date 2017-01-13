import Component from 'can/component/';
import './jqgrid-table.less!';
import template from './jqgrid-table.stache!';
import ViewModel from './jqgrid-table.viewmodel';

import 'jquery';
import 'jqGrid/js/jquery.jqGrid';
import 'jqGrid/js/i18n/grid.locale-en';
import 'jqGrid/css/ui.jqgrid.css!';
import './styles/bootstrap.min.css!';
import './styles/ui.jqgrid-bootstrap.css!';

export default Component.extend({
  tag: 'jqgrid-table',
  viewModel: ViewModel,
  events: {
    "inserted": function(){
      this.$el = $(this.element);
      this.initJQGrid();
    },
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
        rowNum: 30
      }).jqGrid("setFrozenColumns");
    }
  },
  template
});