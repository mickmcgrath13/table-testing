import Component from 'can/component/';
import './jqwidgetsgrid-table.less!';
import template from './jqwidgetsgrid-table.stache!';
import ViewModel from './jqwidgetsgrid-table.viewmodel';

import 'jqwidgets-framework/jqwidgets/styles/jqx.base.css!';
import 'jquery';
import 'jqwidgets-framework/jqwidgets/jqxcore';
import 'jqwidgets-framework/jqwidgets/jqxdata';
import 'jqwidgets-framework/jqwidgets/jqxbuttons';
import 'jqwidgets-framework/jqwidgets/jqxscrollbar';
import 'jqwidgets-framework/jqwidgets/jqxmenu';
import 'jqwidgets-framework/jqwidgets/jqxlistbox';
import 'jqwidgets-framework/jqwidgets/jqxdropdownlist';
import 'jqwidgets-framework/jqwidgets/jqxgrid';
import 'jqwidgets-framework/jqwidgets/jqxgrid.selection';
import 'jqwidgets-framework/jqwidgets/jqxgrid.columnsresize';
import 'jqwidgets-framework/jqwidgets/jqxgrid.filter';
import 'jqwidgets-framework/jqwidgets/jqxgrid.sort';
import 'jqwidgets-framework/jqwidgets/jqxgrid.pager';
import 'jqwidgets-framework/jqwidgets/jqxgrid.grouping';

export default Component.extend({
  tag: 'jqwidgetsgrid-table',
  viewModel: ViewModel,
  template,
  events: {
    "inserted": function(){
      this.$el = $(this.element);
      this.initJQWidgetsTable();
    },

    initJQWidgetsTable(){
      let derivedColumns = this.viewModel.attr("tableColumns"),
          derivedAdapter = this.viewModel.attr("dataAdapter");

      this.$el.jqxGrid({
        height:300,
        width: 350,
        source: derivedAdapter,
        columns: derivedColumns,
        sortable: true,
        filterable: true,
        pageable: true,
      });
    }
  }
});