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
    //     //debugging
    //     currentLoop = 0;
    //     //end debugging

    //     //debugging
    //     var sortStart,
    //         sortEnd,
    //         drawStart,
    //         drawEnd;
    //     //end debugging


    //     //debugging
    //     sortStart = new Date().getTime();
    //     //end debugging

    //     //sort new rows
    //     this.data = allRows;
    //     var sortPromise = new Promise((resolve) => {
    //         if(this.runSort && typeof(this.runSort) === "function"){
    //             this.runSort().then(() => {
    //                 // runSort does all of the initBody,etc stuff.  Resolve with false
    //                 // to skip doing it again 
    //                 resolve(false);
    //             });
    //         }else{
    //             this.data.sort((a, b) => {
    //                 return this.sortComparator(a, b, this.options.sortPriority);
    //             });
    //             resolve(this.data);
    //         }
    //     });


    //     sortPromise.then((sortedData) => {
    //         //debugging
    //         sortEnd = new Date().getTime();
    //         console.log("");
    //         console.log("Performance Metrics on [newRows, totalRows]", newRows.length, allRows.length);
    //         console.log("sortTime", sortEnd - sortStart);
    //         //end debugging

    //         //if sortedData is false (sortPromise resolved with false),
    //         //do not draw stuff
    //         if(!sortedData){
    //             return;
    //         }


    //         //debugging
    //         drawStart = new Date().getTime();
    //         //end debugging

    //         this.initPagination();
    //         this.initBody(true);

    //         //debugging
    //         drawEnd = new Date().getTime();
    //         console.log("drawTime", drawEnd - drawStart);
    //         //end debugging
            
    //     });
    // };


    BootstrapTable.prototype.refreshData = function (allRows) {
        //debugging
        currentLoop = 0;
        //end debugging


        //get a diff of the old data and the new data
        var oldRows = this.data,
            newRows;

        //debugging
        var sortStart,
            sortEnd,
            drawStart,
            drawEnd,
            diffStart,
            diffEnd,
            mergeStart,
            mergeEnd;
        //end debugging

        //debugging
        diffStart = new Date().getTime();
        //end debugging

        newRows = this.getRowDiff(allRows, oldRows);

        //debugging
        diffEnd = new Date().getTime();
        //end debugging


        //debugging
        sortStart = new Date().getTime();
        //end debugging

        //sort new rows
        var sortPromise = new Promise((resolve) => {
            if(this.sortData && typeof(this.s ortData) === "function"){
                this.sortData(newRows).then(resolve)
            }else{
                newRows.sort((a, b) => {
                    return this.sortComparator(a, b, this.options.sortPriority);
                });
                resolve(newRows);
            }
        });


        sortPromise.then((newSortedRows) => {
            //debugging
            sortEnd = new Date().getTime();
            //end debugging

            //add the new rows to the data set
            this.isDiffingRows = true;

            //debugging
            mergeStart = new Date().getTime();
            //end debugging
            this.mergeRows(newSortedRows, oldRows, allRows.length).then((mergedRows) => {
                //debugging
                mergeEnd = new Date().getTime();
                //end debugging

                this.data = mergedRows;
                this.isDiffingRows = false;

                //debugging
                drawStart = new Date().getTime();
                //end debugging

                this.initPagination();
                this.initBody(true);

                //debugging
                drawEnd = new Date().getTime();
                //end debugging

                //debugging
                console.log("");
                console.log("Performance Metrics on [newRows, totalRows]", newRows.length, allRows.length);
                console.log("diffTime", diffEnd - diffStart);
                console.log("sortTime", sortEnd - sortStart);
                console.log("mergeTime", mergeEnd - mergeStart);
                console.log("drawTime", drawEnd - drawStart);
                //end debugging
                
            });
            
        });
    };


    BootstrapTable.prototype.mergeRows = function(newRows, oldRows, totalRows){
        var sortPriority = this.options.sortPriority,
            mergedRows = oldRows;

        return new Promise((resolve) => {
            //if there is no sort priority, just add the items to the end
            if(!sortPriority){
                for(var i = oldRows.length, j=0; i < totalRows; i++, j++){
                    mergedRows.splice(i, 0, newRows[j]);
                }
            }else{
                var i = 0,
                    currentNewItem = newRows.shift(),
                    currentItem, comparatorResult, updateRowItem;

                while(i < totalRows){

                    //debugging
                    if(currentLoop++ > loopMax){
                        alert("loopMax hit");
                        break;
                    }
                    //end debugging

                    //exit if we run out of new rows
                    if(!newRows || !newRows.length){
                        break;
                    }

                    currentItem = oldRows[i];
                    updateRowItem = false;

                    //if we've reached the end of the oldRows but still have newRows
                    //  they go at the end
                    if(i > (oldRows.length-1)){
                        mergedRows.splice(i++, 0, currentNewItem);
                        updateRowItem = true;
                    }else{
                        var comparatorResult = this.sortComparator(currentNewItem, currentItem, sortPriority);
                        
                        //new item is before or equal, insert the item
                        if(comparatorResult === -1 || comparatorResult === 0){
                            mergedRows.splice(i++, 0, currentNewItem);
                            updateRowItem = true;
                        }else if(comparatorResult === 1){
                            i++;
                        }else{
                            //should never get here... what do we do???
                            console.warn("Reach supposedly unreachable code - bootstrab-table-refresh-data.js - mergeRows.  Breaking out of row merge");
                            break;
                        }
                    }

                    if(updateRowItem){
                        currentNewItem = newRows.shift();
                    }
                }
            }

            resolve(mergedRows);
        });
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

    //---- END DIFFING ALGORITHM ----//

})($);