import QUnit from 'steal-qunit';
import { ViewModel } from './icanjs-table';

// ViewModel unit tests
QUnit.module('table-testing/components/icanjs-table');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('message'), 'This is the icanjs-table component');
});
