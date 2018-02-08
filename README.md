# vue-table
Best date table for vue2

### How to use?
npm install best-vue-table

Also you can down /dist/vue-table.umd(.min).js

As the name shows, it is a **UMD** bundle!!
So you can import/require or just use script tag!

and use 

```html
<vue-table :columns="todoTable.columns" :options="todoTable.options" :source="todoTable.source"></vue-table>
```

```javascript
import {vueTable} from './vue-table.umd.min.js'
let app = new Vue({
        el: "#app",
        components: {
            vueTable: vueTable
        },
        data: {
            todoTable: {
                options:{
                  styleType:'semantic', //e.g. semantic bootstrap
                  style:{/*see src/style.js */}
                },
                columns: ["id", {name: "desc",display:'Desc'}, {
                    name: "op", format: function (row) {
                        return '<button>OP</button>';
                    }
                }],
                // Promise mode
                // source:function(params) {
                //   return new Promise.resolve([{id:1,desc:'happy to use vue-table'},{id:2,desc:'happy to use vue-table'}])
                // },
                // Data mode
                source:[{id:1,desc:'happy to use vue-table'},{id:2,desc:'happy to use vue-table'}]
                // Api mode
                // source: {apiUrl: "/data/mock.json", method: "GET"}
            }
        }
    });
```
