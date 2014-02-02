module.exports = function(grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        bbs: {
            // potential config here
        },
        compass: {
            dev: {
            }
        },
        watch: {
            sass: {
                files: ['sass/*.scss'],
                tasks: ['compass:dev'],
            },
            livereload: {
                files: ['../templates/**/*.html', '**/*.css', '**/*.js'],
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.registerTask('default', 'watch');
};
