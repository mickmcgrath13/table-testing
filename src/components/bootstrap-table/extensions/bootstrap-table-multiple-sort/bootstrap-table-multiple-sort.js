/**
 * @author Nadim Basalamah <dimbslmh@gmail.com>
`` * @version: v1.2.0
 * https://github.com/nlundquist/bootstrap-table/tree/master/src/extensions/multiple-sort/bootstrap-table-multiple-sort.js
 * Modification: ErwannNevou <https://github.com/ErwannNevou>
 * Modification: Nils Lundquist <https://github.com/nlundquist>
 * Modification: Mick McGrath <https://github.com/mickmcgrath13>
 */


import Comparators from './comparator';

(function($) {
    'use strict';

    var isSingleSort = false;

    var showSortModal = function(that) {
        var _selector = that.$sortModal.selector,
            _id = _selector.substr(1);

        if (!$(_id).hasClass("modal")) {
            var sModal = '  <div class="modal fade" id="' + _id + '" tabindex="-1" role="dialog" aria-labelledby="' + _id + 'Label" aria-hidden="true">';
            sModal += '         <div class="modal-dialog">';
            sModal += '             <div class="modal-content">';
            sModal += '                 <div class="modal-header">';
            sModal += '                     <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
            sModal += '                     <h4 class="modal-title" id="' + _id + 'Label">' + that.options.formatMultipleSort() + '</h4>';
            sModal += '                 </div>';
            sModal += '                 <div class="modal-body">';
            sModal += '                     <div class="bootstrap-table">';
            sModal += '                         <div class="fixed-table-toolbar">';
            sModal += '                             <div class="bars">';
            sModal += '                                 <div id="toolbar">';
            sModal += '                                     <button id="add" type="button" class="btn btn-default"><i class="' + that.options.iconsPrefix + ' ' + that.options.icons.plus + '"></i> ' + that.options.formatAddLevel() + '</button>';
            sModal += '                                     <button id="delete" type="button" class="btn btn-default" disabled><i class="' + that.options.iconsPrefix + ' ' + that.options.icons.minus + '"></i> ' + that.options.formatDeleteLevel() + '</button>';
            sModal += '                                 </div>';
            sModal += '                             </div>';
            sModal += '                         </div>';
            sModal += '                         <div class="fixed-table-container">';
            sModal += '                             <table id="multi-sort" class="table">';
            sModal += '                                 <thead>';
            sModal += '                                     <tr>';
            sModal += '                                         <th></th>';
            sModal += '                                         <th><div class="th-inner">' + that.options.formatColumn() + '</div></th>';
            sModal += '                                         <th><div class="th-inner">' + that.options.formatOrder() + '</div></th>';
            sModal += '                                     </tr>';
            sModal += '                                 </thead>';
            sModal += '                                 <tbody></tbody>';
            sModal += '                             </table>';
            sModal += '                         </div>';
            sModal += '                     </div>';
            sModal += '                 </div>';
            sModal += '                 <div class="modal-footer">';
            sModal += '                     <button type="button" class="btn btn-default" data-dismiss="modal">' + that.options.formatCancel() + '</button>';
            sModal += '                     <button type="button" class="btn btn-primary">' + that.options.formatSort() + '</button>';
            sModal += '                 </div>';
            sModal += '             </div>';
            sModal += '         </div>';
            sModal += '     </div>';

            $('body').append($(sModal));

            that.$sortModal = $(_selector);
            var $rows = that.$sortModal.find('tbody > tr');

            that.$sortModal.off('click', '#add').on('click', '#add', function() {
                var total = that.$sortModal.find('.multi-sort-name:first option').length,
                    current = that.$sortModal.find('tbody tr').length;

                if (current < total) {
                    current++;
                    that.addLevel();
                    that.setButtonStates();
                }
            });

            that.$sortModal.off('click', '#delete').on('click', '#delete', function() {
                var total = that.$sortModal.find('.multi-sort-name:first option').length,
                    current = that.$sortModal.find('tbody tr').length;

                if (current > 1 && current <= total) {
                    current--;
                    that.$sortModal.find('tbody tr:last').remove();
                    that.setButtonStates();
                }
            });

            that.$sortModal.off('click', '.btn-primary').on('click', '.btn-primary', function() {
                var $rows = that.$sortModal.find('tbody > tr'),
                    $alert = that.$sortModal.find('div.alert'),
                    fields = [],
                    results = [];


                that.options.sortPriority = $.map($rows, function(row) {
                    var $row = $(row),
                        name = $row.find('.multi-sort-name').val(),
                        order = $row.find('.multi-sort-order').val();

                    fields.push(name);

                    return {
                        sortName: name,
                        sortOrder: order
                    };
                });

                var sorted_fields = fields.sort();

                for (var i = 0; i < fields.length - 1; i++) {
                    if (sorted_fields[i + 1] == sorted_fields[i]) {
                        results.push(sorted_fields[i]);
                    }
                }

                if (results.length > 0) {
                    if ($alert.length === 0) {
                        $alert = '<div class="alert alert-danger" role="alert"><strong>' + that.options.formatDuplicateAlertTitle() + '</strong> ' + that.options.formatDuplicateAlertDescription() + '</div>';
                        $($alert).insertBefore(that.$sortModal.find('.bars'));
                    }
                } else {
                    if ($alert.length === 1) {
                        $($alert).remove();
                    }

                    that.$sortModal.modal('hide');
                    that.options.sortName = '';

                    if (that.options.sidePagination === 'server') {

                        that.options.queryParams = function(params) {
                            params.multiSort = that.options.sortPriority;
                            return params;
                        };

                        that.initServer(that.options.silentSort);
                        return;
                    }

                    that.applySort();

                }
            });

            if (that.options.sortPriority === null || that.options.sortPriority.length === 0) {
                if (that.options.sortName) {
                    that.options.sortPriority = [{
                        sortName: that.options.sortName,
                        sortOrder: that.options.sortOrder
                    }];
                }
            }
        }
    };

    $.extend($.fn.bootstrapTable.defaults, {
        multiSort: false,
        sortPriority: null,
        sortWithWebWorkers: true,
        sortWebWorkerLoadingIndicatorClass: "loading-indicator pull-right",
        $sortWebWorkerLoadingIndicator:null,
        onSortWebworkerLoading: ()=>{},
        onSortWebworkerLoadingDone: ()=>{}
    });

    $.extend($.fn.bootstrapTable.defaults.icons, {
        sort: 'glyphicon-sort',
        plus: 'glyphicon-plus',
        minus: 'glyphicon-minus'
    });

    $.extend($.fn.bootstrapTable.Constructor.EVENTS, {
        'sort-after.bs.table': 'onSortAfter',
        'sort-webworker-loading.bs.table': 'onSortWebworkerLoading',
        'sort-webworker-loading-done.bs.table': 'onSortWebworkerLoadingDone'
    });

    $.extend($.fn.bootstrapTable.locales, {
        formatMultipleSort: function() {
            return 'Multiple Sort';
        },
        formatAddLevel: function() {
            return 'Add Level';
        },
        formatDeleteLevel: function() {
            return 'Delete Level';
        },
        formatColumn: function() {
            return 'Column';
        },
        formatOrder: function() {
            return 'Order';
        },
        formatSortBy: function() {
            return 'Sort by';
        },
        formatThenBy: function() {
            return 'Then by';
        },
        formatSort: function() {
            return 'Sort';
        },
        formatCancel: function() {
            return 'Cancel';
        },
        formatDuplicateAlertTitle: function() {
            return 'Duplicate(s) detected!';
        },
        formatDuplicateAlertDescription: function() {
            return 'Please remove or change any duplicate column.';
        },
        formatSortOrders: function() {
            return {
                asc: 'Ascending',
                desc: 'Descending'
            };
        }
    });

    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales);

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initToolbar = BootstrapTable.prototype.initToolbar,
        _init = BootstrapTable.prototype.init,
        _onSort = BootstrapTable.prototype.onSort,
        _initBody = BootstrapTable.prototype.initBody;

    BootstrapTable.prototype.initToolbar = function() {
        this.showToolbar = true;
        var that = this,
            sortModalId = '#sortModal_' + this.$el.attr('id');
        this.$sortModal = $(sortModalId);

        _initToolbar.apply(this, Array.prototype.slice.apply(arguments));

        if (this.options.multiSort) {
            var $btnGroup = this.$toolbar.find('>.btn-group').first(),
                $multiSortBtn = this.$toolbar.find('div.multi-sort');

            if (!$multiSortBtn.length) {
                $multiSortBtn = '<button class="multi-sort btn btn-default' + (this.options.iconSize === undefined ? '' : ' btn-' + this.options.iconSize) + '" type="button" title="' + this.options.formatMultipleSort() + '">';
                $multiSortBtn += '  <i class="' + this.options.iconsPrefix + ' ' + this.options.icons.sort + '"></i>';
                $multiSortBtn += '</button>';

                $btnGroup.append($multiSortBtn);

                $($btnGroup).on('click', '.multi-sort', function() {
                    that.redrawSortingTableBody();
                    $('#sortModal_' + that.$el.attr('id')).modal('toggle');
                });

                showSortModal(that);
            }

            this.$el.on('sort.bs.table', function() {
                isSingleSort = true;
            });

            this.$el.on('multiple-sort.bs.table', function() {
                isSingleSort = false;
            });

            this.$el.on('load-success.bs.table', function() {
                if (!isSingleSort && that.options.sortPriority !== null && typeof that.options.sortPriority === 'object') {
                    that.applySort();
                }
            });

            this.$el.on('column-switch.bs.table', function(field, checked) {
                for (var i = 0; i < that.options.sortPriority.length; i++) {
                    if (that.options.sortPriority[i].sortName === checked) {
                        that.options.sortPriority.splice(i, 1);
                    }
                }

                that.assignSortableArrows();
                that.$sortModal.remove();
                showSortModal(that);
            });

            this.$el.on('reset-view.bs.table', function() {
                if (!isSingleSort && that.options.sortPriority !== null && typeof that.options.sortPriority === 'object') {
                    that.assignSortableArrows();
                }
            });
        }
    };

    BootstrapTable.prototype.init = function() {
        _init.apply(this, Array.prototype.slice.apply(arguments));

        // init sorting sorting provided
        if (this.options.sortPriority !== null && typeof this.options.sortPriority === 'object') {
            this.applySort();
        }
    };

    BootstrapTable.prototype.initBody = function() {
        _initBody.apply(this, Array.prototype.slice.apply(arguments));

        if (this.options.sortWithWebWorkers) {
            var $fixedBody = this.$tableBody;

            if (!this.$sortWebWorkerLoadingIndicator || !this.$sortWebWorkerLoadingIndicator.length) {
                if(this.options.$sortWebWorkerLoadingIndicator){
                    this.$sortWebWorkerLoadingIndicator = this.options.$sortWebWorkerLoadingIndicator;
                }else{
                    this.$sortWebWorkerLoadingIndicator = $('<div class="' + this.options.sortWebWorkerLoadingIndicatorClass + '">Loading ...</div>').hide();
                }

                $fixedBody.append(this.$sortWebWorkerLoadingIndicator);
                this.$el.on('sort.bs.table', () => {
                    this.$sortWebWorkerLoadingIndicator &&
                    this.$sortWebWorkerLoadingIndicator.length &&
                    this.$sortWebWorkerLoadingIndicator.css({
                        "top":$fixedBody.scrollTop(),
                        "left":$fixedBody.scrollLeft()
                    }).show();
                });
                this.$el.on('sort-after.bs.table', () => {
                    this.$sortWebWorkerLoadingIndicator &&
                    this.$sortWebWorkerLoadingIndicator.length &&
                    this.$sortWebWorkerLoadingIndicator.css({
                        top:"",
                        left:""
                    }).hide();
                });
            }

        }
    };

    //initSort isn't compatible with multi sort functionality
    BootstrapTable.prototype.initSort = function () {};

    BootstrapTable.prototype.onSort = function(event) {
        if(!this.options.multiSort){
            _onSort.apply(this, Array.prototype.slice.apply(arguments));
            return;
        }

        var $target = $(event.target),
            ctrlOrMeta = event.metaKey || event.ctrlKey,
            columnData = $target.parent('th').data(),
            sortRecords = this.options.sortPriority || []   ,
            sortRecord = {
                sortName: columnData.field,
                sortOrder: columnData.order
            },
            existingSortRecord = null;


        if (this.options.sortable && $target.parent().data().sortable) {
            for (var ri = 0; ri < sortRecords.length; ri++) {
                if (sortRecords[ri].sortName == columnData.field) {
                    existingSortRecord = sortRecords[ri];
                    break;
                }
            }

            // if we've already sorted by this column reverse the direction
            if (existingSortRecord) {
                existingSortRecord.sortOrder = existingSortRecord.sortOrder == 'asc' ? 'desc' : 'asc';
            }

            // reinit sorting if modifier key not held or no sort records
            if (!ctrlOrMeta || !sortRecords) {
                if (existingSortRecord) {
                    sortRecord = existingSortRecord;
                }

                this.options.sortPriority = [sortRecord];
            }
            // if modifier key held either change column direction or add another column
            else {
                // if we've already sorted by this column reverse the direction of the existing sort record
                if (!existingSortRecord) {
                    this.options.sortPriority.push(sortRecord);
                }
            }

            this.applySort(event);
        }
    };

    BootstrapTable.prototype.redrawSortingTableBody = function() {
        this.$sortModal.find('#multi-sort > tbody > tr').remove();

        if (this.options.sortPriority !== null && this.options.sortPriority.length > 0) {
            for (var i = 0; i < this.options.sortPriority.length; i++) {
                this.addLevel(i, this.options.sortPriority[i]);
            }
        } else {
            this.addLevel(0);
        }

        this.setButtonStates();
    };

    BootstrapTable.prototype.sortComparator = function(a,b,sortPriority){
        return Comparators.comparator(a,b,sortPriority);
    };

    BootstrapTable.prototype.applySort = function(event) {
        //these events need to wait until the next tick
        //so that the thos.$el.data('bootstrap.table') can be set
        setTimeout(() => {
            this.trigger('sort', this.options.sortPriority);
            if(this.options.sortWithWebWorkers){
                this.trigger('sort-webworker-loading');
            }
        });

        return this.runSort().then((sortedData) => {
            this.initData(sortedData);
            this.initBody();
            this.assignSortableArrows();
            this.trigger('sort-after');
            if(this.options.sortWithWebWorkers){
                this.trigger('sort-webworker-loading-done');
            }
            return sortedData;
        });
    };

    BootstrapTable.prototype.runSort = function(){
        if(this.currentSortPromise){
            //cancel the promise and remove the event listeners
            this.currentSortPromise.reject();
            delete this.currentSortPromise;
        }

        var data = this.data,
            sortPriority = this.options.sortPriority,
            sortComparator = this.sortComparator,
            sortWithWebWorkers = this.options.sortWithWebWorkers;

        this.currentSortPromise = function(){

            var resolve, reject, always;

            var p = new Promise((_resolve, _reject) => {
                resolve = _resolve;
                reject = _reject;
            });

            p.resolve = resolve;
            p.reject = function(event) {
                if(always){
                    always();
                }
                //TODO: call reject?  do we need it?  must be a new Error...  // reject(new Error());
                // reject.apply(this, Array.prototype.slice.apply(arguments));
            };
            p.isRejectable = true;


            if(sortWithWebWorkers && typeof(window.Worker) !== 'undefined'){
                var worker = new Worker('./extensions/bootstrap-table-multiple-sort/worker-sort.js'),
                    messageCallback = (event) => {
                        p && p.resolve(event.data);
                        always();
                    },
                    errorCallback = (event) => {
                        p && p.reject(event);
                    },
                    removeEventListeners = () => {
                        worker && worker.removeEventListener('message', messageCallback);
                        worker && worker.removeEventListener('error', errorCallback);
                    },
                    addEventListeners = () => {
                        worker && worker.addEventListener('message', messageCallback);
                        worker && worker.addEventListener('error', errorCallback);
                    };

                always = () => {
                    removeEventListeners();
                    worker && worker.terminate();
                };

                addEventListeners();
                worker.postMessage({
                    data: data,
                    sortPriority: sortPriority
                });
            }else{
                data.sort((a, b) => {
                    return sortComparator(a, b, sortPriority);
                });
                p.resolve(data);
            }

            return p;
            
        }();


        //TODO: add to a queue of active promises?

        return this.currentSortPromise.then(d => {
            delete this.currentSortPromise;
            return d;
        });
    };

    BootstrapTable.prototype.addLevel = function(index, sortPriority) {
        var text = index === 0 ? this.options.formatSortBy() : this.options.formatThenBy();

        this.$sortModal.find('tbody')
            .append($('<tr>')
                .append($('<td>').text(text))
                .append($('<td>').append($('<select class="form-control multi-sort-name">')))
                .append($('<td>').append($('<select class="form-control multi-sort-order">')))
            );

        var $multiSortName = this.$sortModal.find('.multi-sort-name').last(),
            $multiSortOrder = this.$sortModal.find('.multi-sort-order').last();

        $.each(this.columns, function(i, column) {
            if (column.sortable === false || column.visible === false) {
                return true;
            }
            $multiSortName.append('<option value="' + column.field + '">' + column.title + '</option>');
        });

        $.each(this.options.formatSortOrders(), function(value, order) {
            $multiSortOrder.append('<option value="' + value + '">' + order + '</option>');
        });

        if (sortPriority !== undefined) {
            $multiSortName.find('option[value="' + sortPriority.sortName + '"]').attr("selected", true);
            $multiSortOrder.find('option[value="' + sortPriority.sortOrder + '"]').attr("selected", true);
        }
    };

    BootstrapTable.prototype.assignSortableArrows = function() {
        var that = this,
            headers = that.$header.find('th'),
            fixedHeaders = that.$fixedHeader.find('th');

        for (var i = 0; i < headers.length; i++) {
            for (var c = 0; c < that.options.sortPriority.length; c++) {
                if ($(headers[i]).data('field') === that.options.sortPriority[c].sortName) {
                    var mainHeader = $(headers[i]),
                        matchedHeaders = mainHeader;

                    // if there are fixed columns include fixed column header
                    if (fixedHeaders.length > 0) {
                        var fixedHeader = fixedHeaders.find('.th-inner:contains('+mainHeader.text()+')').parent();
                        matchedHeaders = matchedHeaders.add(fixedHeader);
                    }

                    matchedHeaders.find('.sortable').removeClass('desc asc').addClass(that.options.sortPriority[c].sortOrder);
                }
            }
        }
    };

    BootstrapTable.prototype.setButtonStates = function() {
        var total = this.$sortModal.find('.multi-sort-name:first option').length,
            current = this.$sortModal.find('tbody tr').length;

        if (current == total) {
            this.$sortModal.find('#add').attr('disabled', 'disabled');
        }
        if (current > 1) {
            this.$sortModal.find('#delete').removeAttr('disabled');
        }
        if (current < total) {
            this.$sortModal.find('#add').removeAttr('disabled');
        }
        if (current == 1) {
            this.$sortModal.find('#delete').attr('disabled', 'disabled');
        }
    };
})(jQuery);