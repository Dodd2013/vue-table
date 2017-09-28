<template>
    <div class='vue-table-pagination-component' :class="styles.pagination">
        <a class="" @click="onPagesClick(pagination.current - 1)"
           :class="[styles.paginationPre,{'disabled':pagination.current === 0}]">
            <i class="" :class="styles.paginationPreIcon"></i>
        </a>
        <a class="" v-for="index in pages" @click="onPagesClick(index - 1)"
           :class="[styles.paginationItem,{'active':pagination.current === index - 1}]">{{ index }}</a>
        <a class="" @click="onPagesClick(pagination.current + 1)"
           :class="[styles.paginationNext,{'disabled':pagination.current === pageCount-1}]">
            <i class="" :class="styles.paginationNextIcon"></i>
        </a>
    </div>
</template>

<script>
    import _ from "lodash";

    export default {
        name: "vue-table-pagination",
        props: {
            styles: {
                type: Object
            },
            pagination: {
                /**
                 * e.g. {current:0,total:30,size:10}
                 */
                type: Object,
                default: function () {
                    return {
                        current: 0,
                        total: 10,
                        size: 10
                    };
                }
            },
            options: {
                type: Object,
                default: function () {
                    return {};
                }
            }

        },
        data() {
            return {};
        },
        methods: {
            onPagesClick: function (index) {
                if (index !== this.pagination.current && index >= 0 && index < this.pageCount) {
                    console.log(index);
                    this.$emit("pageIndexChange", index);
                }
            }
        },
        computed: {
            pageCount: function () {
                return Math.ceil(this.pagination.total / this.pagination.size);
            },
            pages: function () {
                return _.range(1, this.pageCount + 1);
            }
        },
        mounted() {
        }
    };
</script>

<style scoped>

</style>
