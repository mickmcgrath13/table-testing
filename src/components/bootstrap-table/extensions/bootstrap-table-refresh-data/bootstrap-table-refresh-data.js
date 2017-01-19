/**
 * @author mick mcgrath <mick@bitovi.com>
 */

import $ from 'jquery';
import _ from 'lodash';

var loopMax = 50000,
    currentLoop = 0;

(function ($) {
    'use strict';

    $.extend($.fn.bootstrapTable.defaults, {
        diffProp: "id"
    });

    $.fn.bootstrapTable.methods.push('refreshData');

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _init = BootstrapTable.prototype.init,
        _initBody = BootstrapTable.prototype.initBody,
        _initPagination = BootstrapTable.prototype.initPagination;

    BootstrapTable.EVENTS = $.extend(BootstrapTable.EVENTS, {
        // 'page-change-before.bs.table': 'onPageChangeBefore',
        // 'sort-after.bs.table': 'onSortAfter',
    });

    BootstrapTable.prototype.init = function () {
        _init.apply(this, Array.prototype.slice.apply(arguments));
    };

    BootstrapTable.prototype.initBody = function () {
        if(!this.isDiffingRows){
            _initBody.apply(this, Array.prototype.slice.apply(arguments));
        }
    };

    BootstrapTable.prototype.initPagination = function () {
        if(!this.isDiffingRows){
            _initPagination.apply(this, Array.prototype.slice.apply(arguments));
        }
    };


    //---- DIFFING ALGORITHM ----//
    // BootstrapTable.prototype.refreshData = function (allRows) {
    //     var sortStart,
    //         sortEnd,
    //         drawStart,
    //         drawEnd;

    //     sortStart = new Date().getTime();

    //     //sort new rows
    //     allRows.sort((a, b) => {
    //         return this.sortComparator(a, b);
    //     });
    //     this.data = allRows;

    //     sortEnd = new Date().getTime();
        
    //     drawStart = new Date().getTime();
    //     //ensure new, combined data set is sorted properly
    //     this.initPagination();
    //     this.initBody(true);
    //     drawEnd = new Date().getTime();

    //     console.log("sortTime", sortEnd - sortStart);
    //     console.log("drawTime", drawEnd - drawStart);
    // };

    BootstrapTable.prototype.refreshData = function (allRows) {
        //get a diff of the old data and the new data
        var oldRawRows = this.options.data,
            oldFilteredRows = this.data,
            newRows;

        this.options.data = allRows;

        var sortStart,
            sortEnd,
            drawStart,
            drawEnd,
            diffStart,
            diffEnd;

        diffStart = new Date().getTime();
        newRows = this.getRowDiff(allRows, oldRawRows);
        diffEnd = new Date().getTime();

        sortStart = new Date().getTime();

        if (this.options.filtering && this.getFilterChain) {
            newRows = newRows.filter(this.getFilterChain());
        }

        //sort new rows
        newRows.sort((a, b) => {
            return this.sortComparator(a, b);
        });

        //add the new rows to the data set
        this.isDiffingRows = true;

        //if there is no sort priority, just add the items to the end
        if(!this.options.sortPriority){
            this.data.concat(newRows);
        }else{
            var i = 0,
                totalRows = this.data.length + newRows.length,
                currentNewItem = newRows.shift(),
                currentItem, comparatorResult, updateRowItem;

            while(i < totalRows){
                if(currentLoop++ > loopMax){
                    alert("loopMax hit");
                    break;
                }
                //exit if we run out of new rows
                if(!newRows || !newRows.length){
                    break;
                }

                currentItem = oldFilteredRows[i];
                updateRowItem = false;

                //if we've reached the end of the oldRows but still have newRows
                //  they go at the end
                if(i > (oldFilteredRows.length-1)){
                    this.data.push(currentNewItem);
                    i++;
                    updateRowItem = true;
                }else{
                    comparatorResult = this.sortComparator(currentNewItem, currentItem);

                    //new item is before or equal, insert the item
                    if(comparatorResult === -1 || comparatorResult === 0){
                        this.data.push(currentNewItem);
                        i++;
                        updateRowItem = true;
                    }else if(comparatorResult === 1){
                        i++;
                    }
                }
                if(updateRowItem){
                    currentNewItem = newRows.shift();
                }
            }
        }


        this.isDiffingRows = false;


        sortEnd = new Date().getTime();


        drawStart = new Date().getTime();
        //ensure new, combined data set is sorted properly
        this.initPagination();
        this.initBody(true);
        drawEnd = new Date().getTime();

        console.log("diffTime", diffEnd - diffStart);
        console.log("sortTime", sortEnd - sortStart);
        console.log("drawTime", drawEnd - drawStart);
    };

    /*
     * getRowDiff
     * Compares two lists
     * returns a list of differences
     */
    BootstrapTable.prototype.getRowDiff = function(newRows, oldRows){
        return _.differenceBy(newRows, oldRows, (val) => { 
            return val[this.options.diffProp]; 
        });
    };

    BootstrapTable.prototype.addRows = function(rows, sorted){
    };
    //---- END DIFFING ALGORITHM ----//

})($);