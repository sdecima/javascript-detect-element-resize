// package metadata file for Meteor.js
'use strict';

// https://atmospherejs.com/sdecima/javascript-detect-element-resize
var packageName = 'sdecima:javascript-detect-element-resize';
var where = 'client';  // where to install: 'client' or 'server'. For both, pass nothing.

var packageJson = JSON.parse(Npm.require("fs").readFileSync('package.json'));

Package.describe({
  name: packageName,
  summary: 'Official.  Efficient cross-browser, event-based, element resize detection',
  version: packageJson.version,
  git: 'https://github.com/sdecima/javascript-detect-element-resize'
});

Package.onUse(function (api) {
  api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0']);

  /*
   * The library doesn't require jQuery; in theory we should only run the jQuery code if
   * jQuery is detected, but since jquery is a core Meteor package (for now), we always
   * attach it
   */
  api.use('jquery', 'client');

  api.addFiles([
    'detect-element-resize.js',
    'jquery.resize.js'
  ], where
  );
});

Package.onTest(function (api) {
  api.use(packageName, where);
  api.use('tinytest', where);

  api.addFiles('meteor/test.js', where);
});
