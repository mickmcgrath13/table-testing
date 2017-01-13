/**
 * @author mick mcgrath <mick@bitovi.com>
 */

import $ from 'jquery';

(function ($) {
    'use strict';

    $.extend($.fn.bootstrapTable.defaults, {
        onPageChangeBefore: function (number, size) {
            return false;
        }
    });

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _init = BootstrapTable.prototype.init,
        _onPageListChange = BootstrapTable.prototype.onPageListChange,
        _onPageFirst = BootstrapTable.prototype.onPageFirst,
        _onPagePre = BootstrapTable.prototype.onPagePre,
        _onPageNext = BootstrapTable.prototype.onPageNext,
        _onPageLast = BootstrapTable.prototype.onPageLast,
        _onPageNumber = BootstrapTable.prototype.onPageNumber,
        _onSort = BootstrapTable.prototype.onSort;

    BootstrapTable.EVENTS = $.extend(BootstrapTable.EVENTS, {
        'page-change-before.bs.table': 'onPageChangeBefore',
        'sort-after.bs.table': 'onSortAfter',
    });

    BootstrapTable.prototype.init = function () {
        _init.apply(this, Array.prototype.slice.apply(arguments));
    };

    BootstrapTable.prototype.onPageListChange = function (event) {
        //trigger before event
        this.trigger('page-change-before', this.options.pageNumber, this.options.pageSize);
        _onPageListChange.apply(this, Array.prototype.slice.apply(arguments));
    };

    BootstrapTable.prototype.onPageFirst = function (event) {
        //trigger before event
        this.trigger('page-change-before', this.options.pageNumber, this.options.pageSize);
        _onPageFirst.apply(this, Array.prototype.slice.apply(arguments));
    };

    BootstrapTable.prototype.onPagePre = function (event) {
        //trigger before event
        this.trigger('page-change-before', this.options.pageNumber, this.options.pageSize);
        _onPagePre.apply(this, Array.prototype.slice.apply(arguments));
    };

    BootstrapTable.prototype.onPageNext = function (event) {
        //trigger before event
        this.trigger('page-change-before', this.options.pageNumber, this.options.pageSize);
        _onPageNext.apply(this, Array.prototype.slice.apply(arguments));
    };

    BootstrapTable.prototype.onPageLast = function (event) {
        //trigger before event
        this.trigger('page-change-before', this.options.pageNumber, this.options.pageSize);
        _onPageLast.apply(this, Array.prototype.slice.apply(arguments));
    };

    BootstrapTable.prototype.onPageNumber = function (event) {
        //trigger before event
        this.trigger('page-change-before', this.options.pageNumber, this.options.pageSize);
        _onPageNumber.apply(this, Array.prototype.slice.apply(arguments));
    };

    BootstrapTable.prototype.onSort = function (event) {
        //trigger before event
        _onSort.apply(this, Array.prototype.slice.apply(arguments));
        this.trigger('sort-after');
    };
})($);