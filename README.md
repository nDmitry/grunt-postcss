# grunt-postcss
[![Build Status](https://travis-ci.org/nDmitry/grunt-postcss.png?branch=master)](https://travis-ci.org/nDmitry/grunt-postcss)
[![Dependency Status](https://david-dm.org/nDmitry/grunt-postcss.png)](https://david-dm.org/nDmitry/grunt-postcss)

> Apply several post-processors to your CSS using [PostCSS](https://github.com/postcss/postcss).

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-postcss --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-postcss');
```

## Usage

```
$ npm install grunt-postcss pixrem autoprefixer-core cssnano
```

```js
grunt.initConfig({
  postcss: {
    options: {
      map: true, // inline sourcemaps

      // or
      map: {
          inline: false, // save all sourcemaps as separate files...
          annotation: 'dist/css/maps/' // ...to the specified directory
      },

      processors: [
        require('pixrem')(), // add fallbacks for rem units
        require('autoprefixer-core')({browsers: 'last 2 versions'}), // add vendor prefixes
        require('cssnano')() // minify the result
      ]
    },
    dist: {
      src: 'css/*.css'
    }
  }
});
```

#### Plugin specific options

```js
require('postcss-plugin')({option: value})
```

#### options.processors
Type: `Array`
Default value: `[]`

An array of PostCSS compatible post-processors.

#### options.map
Type: `Boolean|Object`
Default value: `false`

If the `map` option isn't defined or is set to `false`, PostCSS won't create or update sourcemaps.

If `true` is specified, PostCSS will try to locate a sourcemap from a previous compilation step using an annotation comment (e.g. from Sass) and create a new sourcemap based on the found one (or just create a new inlined sourcemap). The created sourcemap can be either a separate file or an inlined map depending on what the previous sourcemap was.

You can gain more control over sourcemap generation by assigning an object to the `map` option:

* `prev` (string or `false`): a path to a directory where a previous sourcemap is (e.g. `path/`). By default, PostCSS will try to find a previous sourcemap using a path from the annotation comment (or using the annotation comment itself if the map is inlined). You can also set this option to `false` to delete the previous sourcemap.
* `inline` (boolean): whether a sourcemap will be inlined or not. By default, it will be the same as a previous sourcemap or inlined.
* `annotation` (boolean or string): by default, PostCSS will always add annotation comments with a path to a sourcemap file unless it is inlined or the input CSS does not have an annotation comment. PostCSS presumes that you want to save sourcemaps next to your output CSS files, but you can override this behavior and set a path to a directory as a string value for the option.
* `sourcesContent` (boolean): whether original file contents (e.g. Sass sources) will be included to a sourcemap. By default, it's `true` unless a sourcemap from a previous compilation step has the original contents missing.

#### options.diff
Type: `Boolean|String`
Default value: `false`

Set it to `true` if you want to get a patch file:

```js
options: {
  diff: true // or 'custom/path/to/file.css.patch'
}
```
You can also specify a path where you want the file to be saved.

#### options.safe
Type: `Boolean`
Default value: `false`

Enable or disable [PostCSS safe mode](https://github.com/postcss/postcss#safe-mode).

```js
options: {
  safe: true
}
```

## Why would I use this?

Unlike the traditional approach with separate plugins, grunt-postcss allows you to parse and save CSS only once applying all post-processors in memory and thus reducing your build time. PostCSS is also a simple tool for writing your own CSS post-processors.
