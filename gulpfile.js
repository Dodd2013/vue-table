const gulp = require("gulp");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const rollup = require("rollup");
const rollupVue = require("rollup-plugin-vue");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const rollupBabel = require("rollup-plugin-babel");

const browserSync = require("browser-sync").create();
gulp.task("build", async function () {
    const bundle = await rollup.rollup({
        input: "./src/vue-table.vue",
        plugins: [
            commonjs(),
            rollupVue(),
            rollupBabel(),
            resolve()

        ]
    });

    await bundle.write({
        file: "./dist/vue-table.umd.js",
        format: "umd",
        name: "vueTable",
        sourcemap: true
    });
    await gulp.src("./dist/vue-table.umd.js")
        .pipe(uglify())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest("./dist"))
        .pipe(gulp.dest("./examples"));
});


gulp.task("browser-sync",["build"], function () {
    browserSync.init({
        server: {
            baseDir: "./examples/"
        }
    });

    gulp.watch(["src/**.*"], ["build"]);

    gulp.watch("examples/**.*").on("change", browserSync.reload);
});