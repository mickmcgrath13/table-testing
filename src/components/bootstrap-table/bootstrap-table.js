import Component from 'can/component/';
import './bootstrap-table.less!';
import template from './bootstrap-table.stache!';
import ViewModel from './bootstrap-table.viewmodel';

export default Component.extend({
  tag: 'bootstrap-table',
  viewModel: ViewModel,
  template
});