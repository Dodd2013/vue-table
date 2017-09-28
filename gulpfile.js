const gulp = require("gulp");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const rollup = require("rollup");
const rollupVue = require("rollup-plugin-vue");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const rollupBabel = require("rollup-plugin-babel");

const browserSync = require("browser-sync").create();
gulp.task("build-with-lodash", async function () {
    const bundle = await rollup.rollup({
        input: "./src/main.js",
        plugins: [
            rollupVue({compileTemplate: true, css: true}),
            commonjs(),
            rollupBabel({exclude: "node_modules/**"}),
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
        .pipe(gulp.dest("./examples"))
        .pipe(uglify())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest("./dist"));

});
gulp.task("build-without-lodash", async function () {

    const bundle = await rollup.rollup({
        input: "./src/main.js",
        external: ["lodash"],
        plugins: [
            rollupVue({compileTemplate: true, css: true}),
            commonjs(),
            rollupBabel({exclude: "node_modules/**"}),
            resolve()


        ]
    });

    await bundle.write({
        file: "./dist/vue-table-!lodash.umd.js",
        format: "umd",
        name: "vueTable",
        sourcemap: true
    });
    await gulp.src("./dist/vue-table-!lodash.umd.js")
        .pipe(gulp.dest("./examples"))
        .pipe(uglify())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest("./dist"));
});

gulp.task("build", ["build-with-lodash", "build-without-lodash"]);
gulp.task("browser-sync", ["build-without-lodash"], function () {
    browserSync.init({
        server: {
            baseDir: "./examples/"
        }
    });

    gulp.watch(["src/**/*.*", "src/*"], ["build-without-lodash"]);

    gulp.watch("examples/**.*").on("change", browserSync.reload);
});