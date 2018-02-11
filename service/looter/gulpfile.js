var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", function () {

    // return gulp.src('src/**/*.ts')
    //     .pipe(ts({
    //         noImplicitAny: true,
    //         outFile: 'output.js'
    //     }))
    //     .pipe(gulp.dest('dist'));


    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});
