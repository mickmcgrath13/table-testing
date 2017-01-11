import QUnit from 'steal-qunit';
import { ViewModel } from './jqgrid-table';

// ViewModel unit tests
QUnit.module('table-testing/components/jqgrid-table');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('message'), 'This is the jqgrid-table component');
});
