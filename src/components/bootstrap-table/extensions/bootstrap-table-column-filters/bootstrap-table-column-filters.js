/**
 * @author Nils Lundquist <nils@bitovi.com>
 * @version: v0.0.1
 */

import _ from 'lodash';

(function ($) {

  var BootstrapTable = $.fn.bootstrapTable.Constructor,
      _initHeader = BootstrapTable.prototype.initHeader;

  BootstrapTable.prototype.initHeader = function () {
    _initHeader.apply(this, Array.prototype.slice.apply(arguments));

    if (this.options.filtering) {
      this.initHeaderFilters();
    }
  };

  // this doesn't appear to break anything we use, but it may be an over simplification
  BootstrapTable.prototype.getData = function () {
    return this.data;
  };

  BootstrapTable.prototype.initHeaderFilters = function () {
    var $tableHeaders = this.$header.add(this.$fixedHeader),
        $columnHeaders = $tableHeaders.find('th'),
        table = this,
        delayedValueUpdate = _.debounce(function (event) {
          table.updateFilterValue(event);
        }, 300);

    $columnHeaders
      .filter((i,el)=>$(el).data().filterable)
      .append('<input type="text"/>');

    // trigger filter update handler 300ms after last printable character typed
    $tableHeaders.on('keyup', 'th > input', function(event) {
      if (isPrintableOrBackspace(event.keyCode)) {
        delayedValueUpdate(event);
      }
    });
  };

  BootstrapTable.prototype.updateFilterValue = function(event) {
    var columnHeader = $(event.target.closest('th')),
        columnConfig = columnHeader.data();

    columnConfig.filterValue = event.target.value;

    // overwrite hidden table header col :/
    // without this the visible table header is overwritten with the hidden one
    // by the frequent header reinit causing the input to be blanked out
    this.$el.find('> thead th[data-field='+columnConfig.field+']').replaceWith(columnHeader.clone(true));

    this.applyFilters();
  };

  BootstrapTable.prototype.getFilterChain = function() {
    var columnConfigs = _.filter(
      _.map(this.$header.add(this.$fixedHeader).find('th'), (header)=>$(header).data()),
      (columnConfig)=>columnConfig.filterValue
      ),
      filterFunctions = _.map(columnConfigs, function(columnConfig) {
        return function(row) {
          var value = row[columnConfig.field];

          // convert to string to search for filter substr
          value = value ? value.toString() : "";

          return value.indexOf(columnConfig.filterValue) > -1
        }
      }),
      filterChain = _.reduce(filterFunctions, function(ret, filterFunc) {
        return function(row) {
          if (filterFunc(row)) {
            return ret(row);
          } else {
            return false;
          }
        }
      }, function() { return true; });

    return filterChain;
  };

  BootstrapTable.prototype.applyFilters = function () {
    this.data = _.filter(this.options.data, this.getFilterChain());

    this.updatePagination();
  };

  function isPrintableOrBackspace(keyCode) {
    return (keyCode > 47 && keyCode < 58)   || // number keys
           keyCode == 32 || keyCode == 8    || // spacebar & backspace keys
           (keyCode > 64 && keyCode < 91)   || // letter keys
           (keyCode > 95 && keyCode < 112)  || // numpad keys
           (keyCode > 185 && keyCode < 193) || // ;=,-./` keys
           (keyCode > 218 && keyCode < 223);   // [\]' keys
  }

}(jQuery));