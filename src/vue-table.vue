<template>
    <div class='vue-table-component' :class="style.component">
        <div class="vue-table-toolbar" :class="style.toolbar"></div>
        <div class="vue-table-container" :class="style.tableContainer">
            <table class="vue-table" :class="style.table">
                <thead :class="style.thead">
                <tr><th v-for="column in columnsTitle">{{column}}</th></tr>
                </thead>
                <tbody :class="style.tbody">
                <tr v-for="row in rowData">
                    <td v-for="column in columnsName">
                        <template v-if="!column.hasFormat">
                            {{row[column.name]}}
                        </template>
                        <template v-if="column.hasFormat">
                            {{column.format(row)}}
                        </template>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import style from "./style.js";
    import merge from "lodash/merge";

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
                        styleType: "semantic", //e.g. semanti bootstrap
                        style: {},
                        height: "auto",
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
                rowData: {}
            };
        },
        computed: {},
        methods: {},
        mounted
    };

    /***********************
     * mounted
     ***********************/
    function mounted() {

        this.style = merge(this.options.styleType ? style[this.options.styleType] : {}, this.options.style);

        this.columnsTitle = this.columns.map(function (item) {
            return typeof item === "string" ? item : (item.display || item.name);
        });
        this.columnsName = this.columns.map(function (item) {
            return {
                name: typeof item === "string" ? item : item.name,
                hasFormat: !!item.format,
                format: item.format
            };
        });
        source2RowData(this.source, {count: 10}).then((data) => {
            this.rowData = data;
        });

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
