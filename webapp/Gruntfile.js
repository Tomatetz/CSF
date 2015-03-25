module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            development: {
                options: {
                    paths: ['assets/less'],
                    strictImports: true,
                    compress: true,
                    sourceMap: true,
                    sourceMapRootpath: './',
                    outputSourceFiles: true
                },
                files: {
                    "assets/css/style.css": "assets/less/result/style.less"
                }
            }
        },
        watch: {
            less: {
                files: [
                    'assets/less/base/*.less',
                    'assets/less/blocks/*.less',
                    'assets/less/custom/*.less',
                    'assets/less/mod/*.less',
                    'assets/less/result/*.less'
                ],
                tasks: ['less'],
                options: {
                    spawn: false
                }
            }
        },
        jsdoc : {
            dist : {
                src: ['assets/js/doc/*.js', 'assets/js/entities/*.js'],
                options: {
                    destination: 'doc'
                }
            }
        },
        /* Generating bower_vendors- requireJs config file with paths to bower_components */
        bowerRequirejs: {
            target: {
                rjsConfig: 'assets/js/bower_vendors.js'
            }
        },
        /* Generating optimized.js file with compressed vendors */
        requirejs: {
            std: {
                options: {
                    baseUrl: "webapp/bower_components",
                    mainConfigFile: 'assets/js/bower_vendors.js',
                    wrapShims: true,
                    optimize: 'uglify2',
                    out: "assets/js/optimized.js",
                    include: ['jquery','underscore','backbone','json2','datatables','backbone-forms','localstorage','marionette','tpl','select2','cocktail','d3','text']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-bower-requirejs');
    grunt.loadNpmTasks('grunt-requirejs');

    grunt.registerTask('Update bower_vendors.js and recompile optimized.js', ['bowerRequirejs','requirejs']);
};