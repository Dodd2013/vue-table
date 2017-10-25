<template>
    <div class='vue-table-component' :class="style.component">
        <div class="vue-table-toolbar" :class="style.toolbar"></div>
        <div class="vue-table-container" :class="style.tableContainer">
            <table class="vue-table" :class="[style.table,{'striped':opt.striped}]">
                <thead :class="style.thead">
                <!--<tr v-if="false">-->
                <!--<th :colspan="columnsTitle.length">-->
                <!--<div class="ui grid">-->
                <!--<div class="ten wide column">-->
                <!--<h1>Vue-Table</h1>-->
                <!--</div>-->
                <!--<div class="right aligned six wide column">-->
                <!--<div class="ui search">-->
                <!--<div class="ui icon input">-->
                <!--<input class="prompt" type="text" placeholder="Search countries...">-->
                <!--<i class="search icon"></i>-->
                <!--</div>-->
                <!--<div class="results"></div>-->
                <!--</div>-->
                <!--</div>-->
                <!--</div>-->
                <!--</th>-->
                <!--</tr>-->
                <tr>
                    <th v-for="column in columnsTitle">{{column}}</th>
                </tr>
                </thead>
                <tbody :class="style.tbody">
                <tr v-for="row in displayRowData" @click="onRowSelect(row)"
                    :class="row._vueTable_Selected?style.selectedRow:''">
                    <td v-for="column in columnsName">
                        <span v-if="!column.isAction"
                              v-html="column.hasFormat ? column.format(row) : row[column.name]"></span>
                        <slot v-if="column.isAction" name="action" :row="row"></slot>
                    </td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <th :colspan="columnsTitle.length">
                        <div class="ui grid">
                            <div class="six wide column">

                            </div>
                            <div class="right aligned ten wide column" v-if="opt.pagination.type!=='none'">
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
    import style from './style.js'
    import _ from 'lodash'
    import vueTablePagination from './vue-table-pagination.vue'
    import defaultOpt from './defaultOpt.config'

    export default {
        name: 'vue-table',
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
                default: () => {
                    return {}
                }
            }
        },
        data() {
            return {
                opt: null,
                style: null,
                columnsTitle: null,
                columnsName: null,
                rowData: null,
                serverParams: null,
                mode: null,  //e.g. data, api, promise
                pagination: null,
                clientParams: null,
                selectedRow: null
            }
        },
        computed: {
            hasAction,
            isClientPagination,
            isServerPagination,
            displayRowData
        },
        methods: {
            refresh,
            onPageIndexChange,
            goToPageNum,
            source2RowData,
            initData,
            initServerParams,
            initClientParams,
            onRefreshFinished,
            getClientPaginationData,
            onRowSelect

        },
        mounted,
        beforeMount
    }

    /*******************************
     * methods
     *******************************/
    function onRowSelect(row) {
        if (this.opt.canSelect) {
            if (this.opt.selectMode === 'single') {

                if (this.selectedRow) this.$set(this.selectedRow, '_vueTable_Selected', false)
                this.selectedRow = row
                this.$set(row, '_vueTable_Selected', true)
            }
            //TODO multi select
            if (this.opt.selectMode === 'multi') {
                this.$set(row, '_vueTable_Selected', true)
                if (this.selectedRow) {
                    this.selectedRow.push(row)
                } else {
                    this.selectedRow = [].push(row)
                }
            }
            this.$emit('on-row-select', this.selectedRow)
        }
    }

    function getClientPaginationData() {
        return _.slice(this.rowData, this.clientParams.pagination.offset, this.clientParams.pagination.offset + this.pagination.size)
    }

    function onRefreshFinished(data) {
        if (this.opt.pagination.type === 'client') {
            this.pagination.total = data.length
            this.rowData = data
        }
        if (this.opt.pagination.type === 'server') {
            this.pagination.total = data.total
            this.rowData = data.data
        }
    }

    function onPageIndexChange(pagination) {
        this.$emit('onPageIndexChange', pagination)
        this.goToPageNum(pagination)
    }

    function goToPageNum(pagination) {
        if (this.isServerPagination) {
            this.serverParams.pagination = pagination
            this.refresh()
        }
        if (this.isClientPagination) {
            this.clientParams.pagination = pagination
        }
    }

    function refresh() {
        this.$emit('onRefreshBegin')
        return this.source2RowData().then((data) => {
            this.onRefreshFinished(data)
            this.$emit('onRefreshFinished', data)
        })
    }

    function initServerParams() {
        let serverParams = {}
        if (this.isServerPagination) {
            serverParams.pagination = this.opt.pagination
        }
        return serverParams
    }

    function initClientParams() {
        let clientParams = {}
        if (this.isClientPagination) {
            clientParams.pagination = this.opt.pagination
        }
        return clientParams
    }

    function initData() {
        this.opt = _.merge({}, defaultOpt, this.options)
        this.style = _.merge(this.opt.styleType ? style[this.opt.styleType] : {}, this.opt.style)
        this.columnsTitle = this.columns.map((item) => (typeof item === 'string' ? item : (item.display || item.name)))
        this.columnsName = this.columns.map((item) => {
            return {
                name: typeof item === 'string' ? item : item.name,
                hasFormat: !!item.format,
                isAction: !!item.action,
                format: item.format
            }
        })
        this.pagination = {
            startPage: 0,
            size: this.opt.pagination.size,
            total: 1
        }
        this.mode = 'data'
        this.serverParams = this.initServerParams()
        this.clientParams = this.initClientParams()
    }

    /**
     * Get rowData for source
     * @param source
     * @return {*}
     */
    function source2RowData() {
        let source = this.source
        let params = this.serverParams
        if (source.apiUrl) {
            // api mode
            this.mode = 'api'
            return sourceApiData(source, params)
        } else if (typeof source === 'function') {
            // promise mode
            this.mode = 'promise'
            return source(params)
        } else if (typeof source === 'object') {
            // data mode
            this.mode = 'data'
            return Promise.resolve(source)
        }
    }

    /***********************
     * mounted
     ***********************/

    function mounted() {
        this.refresh()
    }

    /***********************
     * beforeMount
     ***********************/
    function beforeMount() {
        this.initData()
    }

    /***********************
     * computed
     ***********************/


    function hasAction() {
        return !!this.columns.find((item) => {
            return item.action
        })
    }

    function isClientPagination() {
        return this.opt.pagination.type === 'client'
    }

    function isServerPagination() {
        return this.opt.pagination.type === 'server'
    }

    function displayRowData() {
        if (this.isClientPagination) {
            return this.getClientPaginationData()
        }
        if (this.isServerPagination) {
            return this.rowData
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

            let httpRequest = null
            let params = {
                search: serverParams.search
            }
            if (serverParams.pagination) {
                params.offset = serverParams.pagination.offset
                params.size = serverParams.pagination.size
            }

            let paramsStr = []
            let method = source.method.toUpperCase() || 'GET'

            for (let key in params) {
                if (params[key] !== null && typeof(params[key]) !== 'undefined') {
                    paramsStr.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
                }

            }

            if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
                httpRequest = new XMLHttpRequest()
            } else if (window.ActiveXObject) { // IE 6 and older
                httpRequest = new ActiveXObject('Microsoft.XMLHTTP')
            }

            httpRequest.open(method, source.apiUrl + (method === 'GET' ? (source.apiUrl.indexOf('?') > -1 ? '&' : '?') + paramsStr.join('&') : ''))

            httpRequest.setRequestHeader('Content-type', 'application/json')
            for (let header in source.headers) {
                httpRequest.setRequestHeader(header, source.headers[header])
            }
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === 200) {
                        resolve(JSON.parse(httpRequest.responseText))
                    } else {
                        reject({msg: 'Error when get data form server!'})
                    }
                }
            }

            httpRequest.send(paramsStr.join('&'))
        })
    }

</script>

<style scoped>
</style>
