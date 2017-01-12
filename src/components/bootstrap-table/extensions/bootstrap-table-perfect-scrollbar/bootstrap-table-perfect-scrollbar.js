/**
 * @author mick mcgrath <mick@bitovi.com>
 */

import $ from 'jquery';
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/dist/css/perfect-scrollbar.min.css!';
import './bootstrap-table-perfect-scrollbar.less!';

(function ($) {
    'use strict';

    $.extend($.fn.bootstrapTable.defaults, {
        perfectScrollbar: false
    });

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _init = BootstrapTable.prototype.init,
        _resetView = BootstrapTable.prototype.resetView;

    BootstrapTable.prototype.initPerfectScrollbar = function () {
        var $tableBody = this.$tableBody;
        PerfectScrollbar.initialize($tableBody[0], {
          wheelSpeed: 2,
          wheelPropagation: true
        });

    };

    BootstrapTable.prototype.init = function () {
        _init.apply(this, Array.prototype.slice.apply(arguments));

        if (!this.options.perfectScrollbar) {
            return;
        }

        this.initPerfectScrollbar();
    };


    BootstrapTable.prototype.resetView = function () {
        _resetView.apply(this, Array.prototype.slice.apply(arguments));
        //refresh perfect scrollbar
        var $tableBody = this.$tableBody;
        PerfectScrollbar.update($tableBody[0]);
    };
})($);