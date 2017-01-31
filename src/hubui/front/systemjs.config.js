/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'app',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      '@angular/material': 'npm:@angular/material/bundles/material.umd.js',
      // other libraries
      'rxjs':                       'npm:rxjs',
      'hammerjs':                   'npm:hammerjs',
      'moment':                   'npm:moment',
      'ng2-select/components': 'npm:ng2-select/components',
      'angular2-perfect-scrollbar': 'npm:angular2-perfect-scrollbar',
      'ng2-pagination': 'npm:ng2-pagination',
      'ng2-cookies': 'npm:ng2-cookies',
      'angular2-infinite-scroll': 'npm:angular2-infinite-scroll/'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './main.js',
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      },
      'hammerjs': {
        main: './hammer.min.js',
        defaultExtension: 'js'
      },
      'moment': {
          main: './moment.js',
          defaultExtension: 'js'
      },
      'ng2-select/components': {
        main: './select.module.js',
        defaultExtension: 'js'
      },
      'angular2-perfect-scrollbar': {
        main: './lib/index.js',
        defaultExtension: 'js'
      },
      'ng2-pagination':{
        main: './index.js',
        defaultExtension: 'js'
      },
      'ng2-cookies': {
        main: 'ng2-cookies.js',
        defaultExtension: 'js'
      },
      'angular2-infinite-scroll':{
        main: './angular2-infinite-scroll',
        defaultExtension: 'js'
      }
    }
  });
})(this);