import Component from 'can/component/';
import './jqgrid-table.less!';
import template from './jqgrid-table.stache!';
import ViewModel from './jqgrid-table.viewmodel';

export default Component.extend({
  tag: 'jqgrid-table',
  viewModel: ViewModel,
  template
});