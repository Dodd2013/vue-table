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
                                <div class="ui pagination menu">
                                    <a class="icon item">
                                        <i class="left chevron icon"></i>
                                    </a>
                                    <a class="item">1</a>
                                    <a class="item">2</a>
                                    <a class="item">3</a>
                                    <a class="item">4</a>
                                    <a class="icon item">
                                        <i class="right chevron icon"></i>
                                    </a>
                                </div>
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
    import merge from "lodash/merge";
    //    import xss from "xss";

    export default {
        name: "vue-table",
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
                            size: 10,
                            start: 0
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
                style: {},
                columnsTitle: {},
                rowData: {},
                serverParams: {},
                mode: "data"  //e.g. data, api, promise
            };
        },
        computed: {},
        methods: {refresh},
        mounted
    };

    /*******************************
     * methods
     *******************************/

    function refresh() {
        source2RowData(this.source, this.serverParams).then((data) => {
            this.rowData = data;
        });
    }

    /***********************
     * mounted
     ***********************/

    function mounted() {

        //Init Style
        this.style = merge(this.options.styleType ? style[this.options.styleType] : {}, this.options.style);

        // Init column display title
        this.columnsTitle = this.columns.map(function (item) {
            return typeof item === "string" ? item : (item.display || item.name);
        });

        // Init column name for row data
        this.columnsName = this.columns.map(function (item) {
            return {
                name: typeof item === "string" ? item : item.name,
                hasFormat: !!item.format,
                format: item.format
            };
        });
        // Init serverParams
        this.serverParams.pagination = this.options.pagination;

        this.refresh();

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
    function sourceApiData(source, params) {
        return new Promise(function (resolve, reject) {

            let httpRequest = null;
            let paramsStr = [];
            let method = source.method.toUpperCase() || "GET";
            for (let key in params) {
                paramsStr.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
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
                        console.log(httpRequest.responseText);
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
