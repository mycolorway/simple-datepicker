module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'


    sass:
      datepicker:
        options:
          style: 'expanded'
          bundleExec: true
        files:
          'lib/datepicker.css': 'src/datepicker.scss'

    coffee:
      datepicker:
        files:
          'lib/datepicker.js': 'src/datepicker.coffee'

    watch:
      styles:
        files: ['src/*.scss']
        tasks: ['sass']
      scripts:
        files: ['src/*.coffee', 'spec/*.coffee']
        tasks: ['coffee']


  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'

  grunt.registerTask 'default', ['coffee', 'watch']
