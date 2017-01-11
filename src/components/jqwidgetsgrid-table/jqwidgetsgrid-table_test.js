import QUnit from 'steal-qunit';
import { ViewModel } from './jqwidgetsgrid-table';

// ViewModel unit tests
QUnit.module('table-testing/components/jqwidgetsgrid-table');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('message'), 'This is the jqwidgetsgrid-table component');
});
