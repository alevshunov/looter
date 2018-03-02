var gulp = require("gulp");
var ts = require("gulp-typescript");
// var sourceMaps = require('gulp-sourcemaps');
var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js
        // .pipe(sourceMaps.init())
        // .pipe(sourceMaps.write('.', {
        //     sourceRoot: function(file){ return file.cwd + '/src'; }
        // }))
        .pipe(gulp.dest("dist"));
});
