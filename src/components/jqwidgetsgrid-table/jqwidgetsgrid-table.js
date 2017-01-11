import Component from 'can/component/';
import './jqwidgetsgrid-table.less!';
import template from './jqwidgetsgrid-table.stache!';
import ViewModel from './jqwidgetsgrid-table.viewmodel';

export default Component.extend({
  tag: 'jqwidgetsgrid-table',
  viewModel: ViewModel,
  template
});