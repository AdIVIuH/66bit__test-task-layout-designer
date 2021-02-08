"use strict";

let grid = GridStack.init({
    float: false,
    width: 12,
    disableOneColumnMode: true,
    alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    resizable: {
        handles: 'e, se, s, sw, w'
    },
    acceptWidgets: true,
    // dragIn: '.newWidget',  // class that can be dragged from outside
    dragInOptions: {
        revert: 'invalid',
        scroll: false,
        appendTo: 'body',
        helper: 'clone'
    },
    removable: '#trash', // drag-out delete class
    removeTimeout: 100,
    /* defaults */
    // column: 12,
    // minRow: 0,
    // maxRow: 0,
    // itemClass: 'grid-stack-item',
    // placeholderClass: 'grid-stack-placeholder',
    // placeholderText: '',
    // handle: '.grid-stack-item-content',
    // handleClass: null,
    // styleInHead: false,
    // cellHeight: 'auto',
    // cellHeightThrottle: 100,
    // margin: 10,
    // auto: true,
    // minWidth: 768,
    // float: false,
    // staticGrid: false,
    // animate: true,
    // alwaysShowResizeHandle: false,
    // resizable: {
    //     autoHide: true,
    //     handles: 'se'
    // },
    // draggable: {
    //     handle: '.grid-stack-item-content',
    //     scroll: false,
    //     appendTo: 'body'
    // },
    // dragIn: undefined,
    // dragInOptions: {
    //     revert: 'invalid',
    //     handle: '.grid-stack-item-content',
    //     scroll: false,
    //     appendTo: 'body'
    // },
    // disableDrag: false,
    // disableResize: false,
    // rtl: 'auto',
    // removable: false,
    // removableOptions: {
    //     accept: '.grid-stack-item'
    // },
    // removeTimeout: 2000,
    // marginUnit: 'px',
    // cellHeightUnit: 'px',
    // disableOneColumnMode: false,
    // oneColumnModeDomSort: false
});
grid.on('added removed change', function (e, items) {
    let str = '';
    items.forEach(function (item) {
        str += ' (x,y)=' + item.x + ',' + item.y;
    });
    console.log(e.type + ' ' + items.length + ' items:' + str);
});

let layout = 'moveScale';

function resizeGrid() {
    let width = document.body.clientWidth;
    if (width < 400) {
        grid.column(1, layout);
    } else if (width < 500) {
        grid.column(3, layout);
    } else if (width < 700) {
        grid.column(6, layout);
    } else if (width < 950) {
        grid.column(8, layout);
    } else {
        grid.column(12, layout);
    }
};

resizeGrid();
window.addEventListener('resize', resizeGrid);


(function () {
    var originalAddClassMethod = jQuery.fn.addClass;
    $.fn.addClass = function () {
        var result = originalAddClassMethod.apply(this, arguments);
        $(this).trigger('cssClassChanged');
        return result;
    }
})();

let columnsCount = $("#addWidgetModal .widget-parameters .size-selection .width-selection button.active").text();
let rowsCount = $("#addWidgetModal .widget-parameters .size-selection .height-selection button.active").text();
let backgroundColor = "";
let cellWidth = 0;
let cellHeight = 0;
let widthNewWidget = 0;
let heightNewWidget = 0;

setNewWidgetSize(columnsCount, rowsCount);
$("#addWidgetModal").bind('cssClassChanged', function () {
    if ($("#addWidgetModal").hasClass("show")) {
        cellWidth = 100 / 12;
        cellHeight = cellWidth * $("#addWidgetModal .widget-preview").width() / $("#addWidgetModal .widget-preview").height();
        backgroundColor = $("#addWidgetModal .widget-parameters .color-selection button.active").css("backgroundColor");
        console.log(`${columnsCount}, ${rowsCount}, ${backgroundColor}`);
        setNewWidgetSize(columnsCount, rowsCount);
        $("#addWidgetModal .widget-preview .grid-stack-item .grid-stack-item-content").css('backgroundColor', backgroundColor);
    };
});

$("#addWidgetModal .widget-parameters .size-selection .width-selection button").each(function () {
    $(this).bind('cssClassChanged', function () {
        columnsCount = this.innerHTML;
        setNewWidgetSize(columnsCount, rowsCount);
    });
});

$("#addWidgetModal .widget-parameters .size-selection .height-selection button").each(function () {
    $(this).bind('cssClassChanged', function () {
        rowsCount = this.innerHTML;
        setNewWidgetSize(columnsCount, rowsCount);
    });
});

function setNewWidgetSize(columns, rows) {
    heightNewWidget = cellHeight * rows;
    widthNewWidget = cellWidth * columns;
    $("#addWidgetModal .widget-preview .grid-stack-item").attr({
        'gs-h': rows,
        'gs-w': columns
    });
    $("#addWidgetModal .widget-preview .grid-stack-item").css({
        'width': `${widthNewWidget}%`,
        'height': `${heightNewWidget}%`
    });
};

$("#addWidgetModal .widget-parameters .color-selection button").each(function () {
    $(this).bind('cssClassChanged', function () {
        $("#addWidgetModal .widget-preview .grid-stack-item .grid-stack-item-content").css('backgroundColor', backgroundColor);
    });
});

$("#addWidgetModal .widget-parameters .size-selection .width-selection button").click(function (e) {
    e.preventDefault();
    let activeElement = $("#addWidgetModal .widget-parameters .size-selection .width-selection button");
    activeElement.removeClass('active');
    $(this).addClass('active');
});

$("#addWidgetModal .widget-parameters .size-selection .height-selection button").click(function (e) {
    e.preventDefault();
    let activeElement = $("#addWidgetModal .widget-parameters .size-selection .height-selection button");
    activeElement.removeClass('active');
    $(this).addClass('active');
});

$("#addWidgetModal .widget-parameters .color-selection button").click(function (e) {
    e.preventDefault();
    let activeElement = $("#addWidgetModal .widget-parameters .color-selection button");
    activeElement.removeClass('active');
    $(this).addClass('active');
});

$("#addWidgetModal .modal-footer button[type='submit']").click(function (e) {
    e.preventDefault();
    $('#addWidgetModal').modal('hide');
    renderWidget(columnsCount, rowsCount, backgroundColor);
});

function renderWidget(w, h, bg_c) {
    console.log(w, h, bg_c);
    grid.addWidget(
        `<div class="grid-stack-item">
            <div class="grid-stack-item-content" style="background: ${bg_c};">
                
            </div>
        </div>`, {
            w: w,
            h: h
        });
};