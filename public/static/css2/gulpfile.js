var gulp = require("gulp"),
        watch = require("gulp-watch"),
        plumber = require("gulp-plumber"),
        gulpsass = require("gulp-sass"),
        autoprefixer = require("gulp-autoprefixer"),
        cleanCss = require("gulp-clean-css"),
        sourcemaps = require("gulp-sourcemaps"),
        concat = require("gulp-concat"),
        jshint = require("gulp-jshint"),
        uglify = require("gulp-uglify"),
        imagemin = require("gulp-imagemin"),
        livereload = require("gulp-livereload"),
        notify = require("gulp-notify");

var onError = function(err){
    console.log("Se ha producido un error: ", err.message);
    this.emit("end");
}

gulp.task("sass", function(){
    return gulp.src("./style.scss")
            .pipe(plumber({errorHandler:onError}))
            .pipe(sourcemaps.init())
            .pipe(gulpsass())
            .pipe(autoprefixer("last 2 versions"))
            .pipe(gulp.dest("."))
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest("."))
            .pipe(livereload())
            .pipe(notify({message: "Sass task finalizada"}))
});


gulp.task("lint", function(){
    return gulp.src("./js/plugins/**/*.js")
            .pipe(jshint())
});

//gulp.task("javascript", ["lint"], function(){
//    return gulp.src("./js/plugins/**/*.js")
//            .pipe(plumber({errorHandler:onError}))
//            .pipe(concat("plugins.js"))
//            .pipe(gulp.dest("./js"))
//            .pipe(livereload())
//            .pipe(notify({message: "JavaScript task finalizada"}))
//});

gulp.task("imagemin", function(){
    return gulp.src("./imagenes/originales/**/*.*")
            .pipe(plumber({errorHandler:onError}))
            .pipe(imagemin({
                progessive: true,
                interlaced: true
            }))
            .pipe(gulp.dest("./imagenes"))
            .pipe(livereload())
            .pipe(notify({message: "Imagemin task finalizada"}))
});

gulp.task("watch", function(){
    livereload.listen()
    gulp.watch("./sass/**/*.scss", ["sass"])
//    gulp.watch("./js/plugins/**/*.js", ["javascript"])
    gulp.watch("./imagenes/originales/**/*.*", ["imagemin"])
});

gulp.task("default", ["sass", "imagemin", "watch"], function(){
    
});