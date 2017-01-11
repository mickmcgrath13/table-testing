import Component from 'can/component/';
import './icanjs-table.less!';
import template from './icanjs-table.stache!';
import ViewModel from './icanjs-table.viewmodel';

export default Component.extend({
  tag: 'icanjs-table',
  viewModel: ViewModel,
  template
});