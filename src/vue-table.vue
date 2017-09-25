<template>
    <div class='vue-table-component'>
        <div class="vue-table-toolbar"></div>
        <div class="vue-table-container" :class="style.tableContainer">
            <table class="vue-table" :class="style.table">
                <thead>
                <th v-for="column in columnsTitle">{{column}}</th>
                </thead>
                <tbody>
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
                        style: {}
                    };
                }
            }
        },
        data() {
            return {
                style: {},
                columnsTitle: {}
            };
        },
        computed: {
            rowData
        },
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

    }

    /***********************
     * computed
     ***********************/
    function rowData() {
        if (typeof this.source === "object") {
            return this.source;
        }
    }

</script>

<style scoped>

</style>
