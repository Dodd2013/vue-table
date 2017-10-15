<template>
    <div class='vue-table-pagination-component' :class="styles.pagination">
        <a class="" @click="onPagesClick(currentPage - 1)"
           :class="[styles.paginationPre,{'disabled': currentPage === 1}]">
            <i class="" :class="styles.paginationPreIcon"></i>
        </a>
        <a class="" v-for="index in pages" @click="onPagesClick(index)"
           :class="[styles.paginationItem,{'active': currentPage === index }]">{{ index }}</a>
        <a class="" @click="onPagesClick(currentPage + 1)"
           :class="[styles.paginationNext,{'disabled': currentPage === pageCount }]">
            <i class="" :class="styles.paginationNextIcon"></i>
        </a>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
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
                default: function () {
                    return {
                        startPage: 0,
                        total: 10,
                        size: 10
                    }
                }
            },
            options: {
                type: Object,
                default: function () {
                    return {}
                }
            }

        },
        data() {
            return {
                //1 based currentPage
                currentPage: 1
            }
        },
        methods: {
            onPagesClick
        },
        computed: {
            pageCount: function () {
                return Math.ceil(this.pagination.total / this.pagination.size)
            },
            pages: function () {
                return _.range(1, this.pageCount + 1)
            },
            offset: function () {
                return (this.currentPage - 1) * this.pagination.size
            }
        },
        mounted() {
//            this.initPage()
        }
    }

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
            this.currentPage = index
            let pagination = {
                current: this.currentPage,
                size: this.pagination.size,
                offset: this.offset
            }
            this.$emit('pageIndexChange', pagination)
        }
    }
</script>

<style scoped>

</style>
