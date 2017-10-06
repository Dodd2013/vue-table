<template>
    <div class='vue-table-component' :class="style.component">
        <div class="vue-table-toolbar" :class="style.toolbar"></div>
        <div class="vue-table-container" :class="style.tableContainer">
            <table class="vue-table" :class="[style.table,{'striped':options.striped}]">
                <thead :class="style.thead">
                <tr>
                    <th :colspan="columnsTitle.length">
                        <div class="ui grid">
                            <div class="ten wide column">
                                <h1>Vue-Table</h1>
                            </div>
                            <div class="right aligned six wide column">
                                <div class="ui search">
                                    <div class="ui icon input">
                                        <input class="prompt" type="text" placeholder="Search countries...">
                                        <i class="search icon"></i>
                                    </div>
                                    <div class="results"></div>
                                </div>
                            </div>
                        </div>
                    </th>
                </tr>
                <tr>
                    <th v-for="column in columnsTitle">{{column}}</th>
                </tr>
                </thead>
                <tbody :class="style.tbody">
                <tr v-for="row in rowData">
                    <td v-for="column in columnsName"
                        v-html="column.hasFormat ? column.format(row) : row[column.name]"></td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <th :colspan="columnsTitle.length">
                        <div class="ui grid">
                            <div class="six wide column">

                            </div>
                            <div class="right aligned ten wide column">
                                <vue-table-pagination :styles="style" @pageIndexChange="onPageIndexChange"
                                                      :pagination="pagination"></vue-table-pagination>
                            </div>
                        </div>
                    </th>
                </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script>
    import style from "./style.js";
    import _ from "lodash";
    import vueTablePagination from "./vue-table-pagination.vue";


    export default {
        name: "vue-table",
        components: {
            vueTablePagination
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
                default: function () {
                    return {
                        pagination: {
                            type: "client",  //e.g. client server none
                            size: 10
                        },
                        styleType: "semantic", //e.g. semantic bootstrap
                        style: {},
                        undefinedText: "-",
                        striped: false
                    };
                }
            }
        },
        data() {
            return {
                style: _.merge(this.options.styleType ? style[this.options.styleType] : {}, this.options.style),
                columnsTitle: this.columns.map((item) => (typeof item === "string" ? item : (item.display || item.name))),
                columnsName: this.columnsName = this.columns.map((item) => {
                    return {
                        name: typeof item === "string" ? item : item.name,
                        hasFormat: !!item.format,
                        format: item.format
                    };
                }),
                rowData: {},
                serverParams: {pagination: this.options.pagination},
                mode: "data",  //e.g. data, api, promise
                pagination: {
                    startPage: 0,
                    size: this.options.pagination.size,
                    total: 50
                }
            };
        },
        computed: {},
        methods: {
            refresh,
            onPageIndexChange,
            goToPageNum
        },
        mounted
    };

    /*******************************
     * methods
     *******************************/
    function onPageIndexChange(pagination) {
        this.$emit("onPageIndexChange", pagination);
        this.goToPageNum(pagination);
    }

    function goToPageNum(pagination) {
        this.serverParams.pagination = pagination;
        this.refresh();
    }

    function refresh() {
        this.$emit("onRefreshBegin");
        return source2RowData(this.source, this.serverParams).then((data) => {
            this.rowData = data;
            this.$emit("onRefreshFinished");
        });
    }

    /***********************
     * mounted
     ***********************/

    function mounted() {

    }

    /***********************
     * computed
     ***********************/

    /**
     * Get rowData for source
     * @param source
     * @return {*}
     */
    function source2RowData(source, params) {

        if (source.apiUrl) {
            // api mode
            return sourceApiData(source, params);
        } else if (typeof source === "function") {
            // promise mode
            return source(params);
        } else if (typeof source === "object") {
            // data mode
            return Promise.resolve(source);
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

            let httpRequest = null;
            let params = {
                offset: serverParams.pagination.offset,
                size: serverParams.pagination.size,
                search: serverParams.search
            };
            let paramsStr = [];
            let method = source.method.toUpperCase() || "GET";

            for (let key in params) {
                if (params[key] !== null && typeof(params[key]) !== "undefined") {
                    paramsStr.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
                }

            }

            if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
                httpRequest = new XMLHttpRequest();
            } else if (window.ActiveXObject) { // IE 6 and older
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            }

            httpRequest.open(method, source.apiUrl + (method === "GET" ? (source.apiUrl.indexOf("?") > -1 ? "&" : "?") + paramsStr.join("&") : ""));

            httpRequest.setRequestHeader("Content-type", "application/json");
            for (let header in source.headers) {
                httpRequest.setRequestHeader(header, source.headers[header]);
            }
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === 200) {
                        resolve(JSON.parse(httpRequest.responseText));
                    } else {
                        reject({msg: "Error when get data form server!"});
                    }
                }
            };

            httpRequest.send(paramsStr.join("&"));
        });
    }

</script>

<style scoped>
</style>
