/**
 * @author mick mcgrath <mick@bitovi.com>
 * This is just an example of how to create an extension for the jqxGrid
 * Better examples might be available with the full source code of jqxGrid
 * ...but this will do otherwise.
 *
 * THIS FILE IS NOT NECESSARY
 * The intent of this file was originally to provide a before page change evnet.
 * However, jqxGrid provides a "pagechanging" event that we can use instead.
 *  ...that method is undocumented... http://www.jqwidgets.com/jquery-widgets-documentation/documentation/jqxgrid/jquery-grid-api.htm?search=
 */

import $ from 'jquery';
import jqxCore from 'jqwidgets-framework/jqwidgets/jqxcore';
import jqxGridPager from 'jqwidgets-framework/jqwidgets/jqxgrid.pager';

(function ($, jqxBaseFramework) {
    'use strict';

    var TableProto = jqxBaseFramework.jqx._jqxGrid.prototype,
        _initpager = TableProto._initpager,
        _gotoprevpage = TableProto.gotoprevpage,
        _gotonextpage = TableProto.gotonextpage,
        _sortby = TableProto.sortby,
        beforepagechangedeventindex = -1,
        beforepagesortbyeventindex = -1;

    jqxBaseFramework.extend(TableProto, {
        _initpager: function() {
            
            this.events.push("beforePageChanged");
            beforepagechangedeventindex = this.events.length-1;

            this.events.push("beforesortby");
            beforepagesortbyeventindex = this.events.length-1;

            _initpager.apply(this, Array.prototype.slice.apply(arguments));
        },
        gotoprevpage: function (event) {
            //trigger before event
            if(beforepagechangedeventindex >= 0){
                this._raiseEvent(beforepagechangedeventindex, {
                    pagenum: this.dataview.pagenum,
                    pagesize: this.dataview.pagesize
                });
            }
            // this.trigger('page-change-before', this.options.pageNumber, this.options.pageSize);
            _gotoprevpage.apply(this, Array.prototype.slice.apply(arguments));
        },

        gotonextpage: function (event) {
            //trigger before event
            if(beforepagechangedeventindex >= 0){
                this._raiseEvent(beforepagechangedeventindex, {
                    pagenum: this.dataview.pagenum,
                    pagesize: this.dataview.pagesize
                });
            }
            _gotonextpage.apply(this, Array.prototype.slice.apply(arguments));
        },

        sortby: function (event) {
            //trigger before event
            if(beforepagesortbyeventindex >= 0){
                this._raiseEvent(beforepagesortbyeventindex, {
                });
            }
            _sortby.apply(this, Array.prototype.slice.apply(arguments));
        }
    })
    
})($, jqxCore.jqxBaseFramework);