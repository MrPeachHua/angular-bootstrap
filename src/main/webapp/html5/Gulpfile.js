var gulp=require('gulp');                                  //- 主文件
var concat=require('gulp-concat');                         //- 多个文件合并为一个文件
var minifyCss=require('gulp-minify-css');                  //- 压缩css为一行
var rev=require('gulp-rev');                               //- 对文件名加md5后缀
var revCollector = require('gulp-rev-collector');          //- 路径替换
var watch=require('gulp-watch');                           //- 监听文件
var clean=require('gulp-clean');                           //- 清除文件
var uglify=require('gulp-uglify');                         //- 压缩js文件
var rename=require('gulp-rename');                         //- 重命名




//目标目录清理
gulp.task('clean',function(){
    gulp.src(['./build/css','./build/javascript','./build/rev','./build/common','./build/images'],{read:false})
        .pipe(clean());
});

//合并一些公用的js
gulp.task('scripts',function(){
    gulp.src(['./scripts/jquery-1.9.1.min.js',
        './scripts/layer/layer.js',
        './scripts/angular.min.js',
        './scripts/angular-local-storage.min.js',
        './js/tool/truncate.js',
        './scripts/angular-ui-router.min.js',
        './dist/ocLazyLoad.min.js'])

        .pipe(concat('main.js'))
        .pipe(gulp.dest('./build/common/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./build/common/js'))

});
//合并一些公用的css
gulp.task('css',function(){
    gulp.src(['./content/bootstrap.min.css','./scripts/layer/need/layer.css'])
        .pipe(concat('wap.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./build/common/css'))
});

// 合并 app.config.js / oclazyload.confi.js / route.config.js
gulp.task('config',function(){
    gulp.src(['./js/config/app.config.js',
        './js/config/oclazyload.config.js',
        './js/config/route.config.js'
    ])
        .pipe(concat('config.min.js'))
        .pipe(gulp.dest('./build/javascript/config'))
});

// 处理fonts字体
gulp.task('fonts',function(){
    gulp.src('./fonts/*')
        .pipe(gulp.dest('./build/common/fonts'))
});
// 处理的图片
gulp.task('images',function(){
    gulp.src('./images/**/*')
        .pipe(gulp.dest('./build/images'))
})


//需要处理的css文件
gulp.task('cssMinify',function(){
    gulp.src(['./css/*.css'])
        .pipe(minifyCss())
        .pipe(rev())
        .pipe(gulp.dest('./build/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./build/rev/css'));
});


//需要处理的 js/controllers 文件
gulp.task('contMinify',function(){
    gulp.src('./js/controllers/*.js')
        .pipe(rev())
        .pipe(gulp.dest('./build/javascript/controllers'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./build/rev/contorllers'))
});

//需要处理的 js/services 文件
gulp.task('serMinify',function(){
    gulp.src(['./js/services/*.js'])
        .pipe(rev())
        .pipe(gulp.dest('./build/javascript/services'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./build/rev/services'))
});


gulp.task("revConfig",function(){
    gulp.src(['./build/rev/css/*.json','./build/rev/contorllers/*.json','./build/rev/services/*.json','./build/javascript/config/config.min.js'])
        .pipe(revCollector())
        .pipe(gulp.dest('./build/javascript/config'))

});


//预设任务
gulp.task('default',function(){
    gulp.start('clean');
    setTimeout(function(){
        gulp.start('css');
    },300);
    setTimeout(function(){
        gulp.start('fonts');
    },600);
    setTimeout(function(){
        gulp.start('images');
    },900);
    setTimeout(function(){
        gulp.start('config')
    },1200);
    setTimeout(function(){
        gulp.start('cssMinify');
    },1500);
    setTimeout(function(){
        gulp.start('contMinify');
    },1800);
    setTimeout(function(){
        gulp.start('serMinify');
    },2200);
    setTimeout(function(){
        gulp.start('revConfig');
    },2800);
    setTimeout(function(){
        gulp.start('scripts');
    },3500);

});

gulp.task('help',function(){
    console.log("注意:gulp自动构建,编译后生成文件放在build文件夹里,在系统里引用的资源路径是编译之后生成的新路径," +
        "build/javascript/config放置配置文件，" +
        "build/css放置样式资源文件，" +
        "build/javascript/controllers放置控制器文件," +
        "build/javascript/services放置服务文件," +
        "build/javascript/js放置公用的js文件");
    console.log('命令:'+'gulp clean            --目标目录清理');
    console.log('命令:'+'gulp css              --合并css库');
    console.log('命令:'+'gulp scripts          --合并js类库');
    console.log('命令:'+'gulp fonts            --处理fonts 字体');
    console.log('命令:'+'gulp images            --处理images 图片');
    console.log('命令:'+'gulp config           --合并配置文件');
    console.log('命令:'+'gulp cssMinify        --压缩css文件和重命名');
    console.log('命令:'+'gulp contMinify       --js-controller重命名');
    console.log('命令:'+'gulp serMinify        --js-services重命名');
    console.log('命令:'+'gulp revConfig        --替换配置文件的路径')
});
