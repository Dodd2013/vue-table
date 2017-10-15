(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash')) :
	typeof define === 'function' && define.amd ? define(['exports', 'lodash'], factory) :
	(factory((global.vueTable = {}),global._));
}(this, (function (exports,_) { 'use strict';

_ = _ && _.hasOwnProperty('default') ? _['default'] : _;

var semantic = {
    tableContainer: "",
    table: "ui celled teal table",
    pagination: "ui pagination menu",
    paginationItem: "item",
    paginationPre: "icon item",
    paginationNext: "icon item",
    paginationPreIcon: "left chevron icon",
    paginationNextIcon: "right chevron icon"
};
var bootstrap = {};

var style = {
    semantic: semantic,
    bootstrap: bootstrap
};

(function () {
    if (typeof document !== 'undefined') {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            css = " /*# sourceMappingURL=vue-table-pagination.vue.map */";style.type = 'text/css';if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }head.appendChild(style);
    }
})();

var vueTablePagination = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "vue-table-pagination-component", class: _vm.styles.pagination }, [_c('a', { class: [_vm.styles.paginationPre, { 'disabled': _vm.currentPage === 1 }], on: { "click": function click($event) {
                    _vm.onPagesClick(_vm.currentPage - 1);
                } } }, [_c('i', { class: _vm.styles.paginationPreIcon })]), _vm._v(" "), _vm._l(_vm.pages, function (index) {
            return _c('a', { class: [_vm.styles.paginationItem, { 'active': _vm.currentPage === index }], on: { "click": function click($event) {
                        _vm.onPagesClick(index);
                    } } }, [_vm._v(_vm._s(index))]);
        }), _vm._v(" "), _c('a', { class: [_vm.styles.paginationNext, { 'disabled': _vm.currentPage === _vm.pageCount }], on: { "click": function click($event) {
                    _vm.onPagesClick(_vm.currentPage + 1);
                } } }, [_c('i', { class: _vm.styles.paginationNextIcon })])], 2);
    }, staticRenderFns: [], _scopeId: 'data-v-fb2af88e',
    name: 'vue-table-pagination',
    props: {
        styles: {
            type: Object
        },
        pagination: {
            /**
             * e.g. {offset:0,total:30,size:10}
             */
            type: Object,
            default: function _default() {
                return {
                    startPage: 0,
                    total: 10,
                    size: 10
                };
            }
        },
        options: {
            type: Object,
            default: function _default() {
                return {};
            }
        }

    },
    data: function data() {
        return {
            //1 based currentPage
            currentPage: 1
        };
    },

    methods: {
        onPagesClick: onPagesClick
    },
    computed: {
        pageCount: function pageCount() {
            return Math.ceil(this.pagination.total / this.pagination.size);
        },
        pages: function pages() {
            return _.range(1, this.pageCount + 1);
        },
        offset: function offset() {
            return (this.currentPage - 1) * this.pagination.size;
        }
    },
    mounted: function mounted() {
        //            this.initPage()
    }
};

/*******************************************
 * methods
 *******************************************/
//    function initPage() {
//        this.onPagesClick(this.pagination.startPage + 1)
//    }

/**
 * OnPagesClick
 * @param index
 */
function onPagesClick(index) {
    if (index !== this.currentPage && index > 0 && index <= this.pageCount) {
        this.currentPage = index;
        var pagination = {
            current: this.currentPage,
            size: this.pagination.size,
            offset: this.offset
        };
        this.$emit('pageIndexChange', pagination);
    }
}

var defaultOpt = {
    pagination: {
        type: 'client', //e.g. client server none
        offset: 0,
        size: 10
    },
    styleType: 'semantic', //e.g. semantic bootstrap
    style: {},
    undefinedText: '-',
    striped: false
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

(function () {
    if (typeof document !== 'undefined') {
        var head = document.head || document.getElementsByTagName('head')[0],
            style$$1 = document.createElement('style'),
            css = " /*# sourceMappingURL=vue-table.vue.map */";style$$1.type = 'text/css';if (style$$1.styleSheet) {
            style$$1.styleSheet.cssText = css;
        } else {
            style$$1.appendChild(document.createTextNode(css));
        }head.appendChild(style$$1);
    }
})();

var vueTable = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "vue-table-component", class: _vm.style.component }, [_c('div', { staticClass: "vue-table-toolbar", class: _vm.style.toolbar }), _vm._v(" "), _c('div', { staticClass: "vue-table-container", class: _vm.style.tableContainer }, [_c('table', { staticClass: "vue-table", class: [_vm.style.table, { 'striped': _vm.opt.striped }] }, [_c('thead', { class: _vm.style.thead }, [_c('tr', _vm._l(_vm.columnsTitle, function (column) {
            return _c('th', [_vm._v(_vm._s(column))]);
        }))]), _vm._v(" "), _c('tbody', { class: _vm.style.tbody }, _vm._l(_vm.displayRowData, function (row) {
            return _c('tr', _vm._l(_vm.columnsName, function (column) {
                return _c('td', [!column.isAction ? _c('span', { domProps: { "innerHTML": _vm._s(column.hasFormat ? column.format(row) : row[column.name]) } }) : _vm._e(), _vm._v(" "), column.isAction ? _vm._t("action", null, { row: row }) : _vm._e()], 2);
            }));
        })), _vm._v(" "), _c('tfoot', [_c('tr', [_c('th', { attrs: { "colspan": _vm.columnsTitle.length } }, [_c('div', { staticClass: "ui grid" }, [_c('div', { staticClass: "six wide column" }), _vm._v(" "), _vm.opt.pagination.type !== 'none' ? _c('div', { staticClass: "right aligned ten wide column" }, [_c('vue-table-pagination', { attrs: { "styles": _vm.style, "pagination": _vm.pagination }, on: { "pageIndexChange": _vm.onPageIndexChange } })], 1) : _vm._e()])])])])])])]);
    }, staticRenderFns: [], _scopeId: 'data-v-19f1d484',
    name: 'vue-table',
    components: {
        vueTablePagination: vueTablePagination
    },
    props: {
        source: {
            type: [Object, Function, Array]
        },
        columns: {
            type: Array,
            required: true
        },
        options: {
            type: [Object],
            default: function _default() {
                return {};
            }
        }
    },
    data: function data() {
        return {
            opt: null,
            style: null,
            columnsTitle: null,
            columnsName: null,
            rowData: null,
            serverParams: null,
            mode: null, //e.g. data, api, promise
            pagination: null,
            clientParams: null
        };
    },

    computed: {
        hasAction: hasAction,
        isClientPagination: isClientPagination,
        isServerPagination: isServerPagination,
        displayRowData: displayRowData
    },
    methods: {
        refresh: refresh,
        onPageIndexChange: onPageIndexChange,
        goToPageNum: goToPageNum,
        source2RowData: source2RowData,
        initData: initData,
        initServerParams: initServerParams,
        initClientParams: initClientParams,
        onRefreshFinished: onRefreshFinished,
        getClientPaginationData: getClientPaginationData

    },
    mounted: mounted,
    beforeMount: beforeMount

    /*******************************
     * methods
     *******************************/
};function getClientPaginationData() {
    return _.slice(this.rowData, this.clientParams.pagination.offset, this.clientParams.pagination.offset + this.pagination.size);
}

function onRefreshFinished(data) {
    if (this.opt.pagination.type === 'client') {
        this.pagination.total = data.length;
        this.rowData = data;
    }
    if (this.opt.pagination.type === 'server') {
        this.pagination.total = data.total;
        this.rowData = data.data;
    }
}

function onPageIndexChange(pagination) {
    this.$emit('onPageIndexChange', pagination);
    this.goToPageNum(pagination);
}

function goToPageNum(pagination) {
    if (this.isServerPagination) {
        this.serverParams.pagination = pagination;
        this.refresh();
    }
    if (this.isClientPagination) {
        this.clientParams.pagination = pagination;
    }
}

function refresh() {
    var _this = this;

    this.$emit('onRefreshBegin');
    return this.source2RowData().then(function (data) {
        _this.onRefreshFinished(data);
        _this.$emit('onRefreshFinished', data);
    });
}

function initServerParams() {
    var serverParams = {};
    if (this.isServerPagination) {
        serverParams.pagination = this.opt.pagination;
    }
    return serverParams;
}

function initClientParams() {
    var clientParams = {};
    if (this.isClientPagination) {
        clientParams.pagination = this.opt.pagination;
    }
    return clientParams;
}

function initData() {
    this.opt = _.merge({}, defaultOpt, this.options);
    this.style = _.merge(this.opt.styleType ? style[this.opt.styleType] : {}, this.opt.style);
    this.columnsTitle = this.columns.map(function (item) {
        return typeof item === 'string' ? item : item.display || item.name;
    });
    this.columnsName = this.columns.map(function (item) {
        return {
            name: typeof item === 'string' ? item : item.name,
            hasFormat: !!item.format,
            isAction: !!item.action,
            format: item.format
        };
    });
    this.pagination = {
        startPage: 0,
        size: this.opt.pagination.size,
        total: 1
    };
    this.mode = 'data';
    this.serverParams = this.initServerParams();
    this.clientParams = this.initClientParams();
}

/**
 * Get rowData for source
 * @param source
 * @return {*}
 */
function source2RowData() {
    var source = this.source;
    var params = this.serverParams;
    if (source.apiUrl) {
        // api mode
        this.mode = 'api';
        return sourceApiData(source, params);
    } else if (typeof source === 'function') {
        // promise mode
        this.mode = 'promise';
        return source(params);
    } else if ((typeof source === 'undefined' ? 'undefined' : _typeof(source)) === 'object') {
        // data mode
        this.mode = 'data';
        return Promise.resolve(source);
    }
}

/***********************
 * mounted
 ***********************/

function mounted() {
    this.refresh();
}

/***********************
 * beforeMount
 ***********************/
function beforeMount() {
    this.initData();
}

/***********************
 * computed
 ***********************/
function hasAction() {
    return !!this.columns.find(function (item) {
        return item.action;
    });
}

function isClientPagination() {
    return this.opt.pagination.type === 'client';
}

function isServerPagination() {
    return this.opt.pagination.type === 'server';
}

function displayRowData() {
    if (this.isClientPagination) {
        return this.getClientPaginationData();
    }
    if (this.isServerPagination) {
        return this.rowData;
    }
}

/**
 * For api mode, we ues XMLHttpRequest to get data
 * @param source
 * @param params
 * @return {Promise}
 */
function sourceApiData(source, serverParams) {
    return new Promise(function (resolve, reject) {

        var httpRequest = null;
        var params = {
            search: serverParams.search
        };
        if (serverParams.pagination) {
            params.offset = serverParams.pagination.offset;
            params.size = serverParams.pagination.size;
        }

        var paramsStr = [];
        var method = source.method.toUpperCase() || 'GET';

        for (var key in params) {
            if (params[key] !== null && typeof params[key] !== 'undefined') {
                paramsStr.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
            }
        }

        if (window.XMLHttpRequest) {
            // Mozilla, Safari, IE7+ ...
            httpRequest = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            // IE 6 and older
            httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
        }

        httpRequest.open(method, source.apiUrl + (method === 'GET' ? (source.apiUrl.indexOf('?') > -1 ? '&' : '?') + paramsStr.join('&') : ''));

        httpRequest.setRequestHeader('Content-type', 'application/json');
        for (var header in source.headers) {
            httpRequest.setRequestHeader(header, source.headers[header]);
        }
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    resolve(JSON.parse(httpRequest.responseText));
                } else {
                    reject({ msg: 'Error when get data form server!' });
                }
            }
        };

        httpRequest.send(paramsStr.join('&'));
    });
}

(function () {
    if (typeof document !== 'undefined') {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            css = " /*# sourceMappingURL=vue-table-info.vue.map */";style.type = 'text/css';if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }head.appendChild(style);
    }
})();

var vueTableInfo = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "vue-table-info-component" });
    }, staticRenderFns: [], _scopeId: 'data-v-a3818fe6',
    name: 'vue-table-info',
    data: function data() {
        return {};
    },

    methods: {},
    mounted: function mounted() {}
};

exports.vueTable = vueTable;
exports.vueTableInfo = vueTableInfo;
exports.vueTablePagination = vueTablePagination;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vue-table-!lodash.umd.js.map
