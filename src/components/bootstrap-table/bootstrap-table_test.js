import QUnit from 'steal-qunit';
import { ViewModel } from './bootstrap-table';

// ViewModel unit tests
QUnit.module('table-testing/components/bootstrap-table');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('message'), 'This is the bootstrap-table component');
});
