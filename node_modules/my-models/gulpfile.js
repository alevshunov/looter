const gulp = require("gulp");
const ts = require("gulp-typescript");
// var sourceMaps = require('gulp-sourcemaps');
const tsProject = ts.createProject("tsconfig.json");

gulp.task("default", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js
        // .pipe(sourceMaps.init())
        // .pipe(sourceMaps.write('.', {
        //     sourceRoot: function(file){ return file.cwd + '/src'; }
        // }))
        .pipe(gulp.dest("."));
});
