require.config({
  shim: {

  },

  paths: {
    jquery: 'vendor/jquery.min',
    dot: 'vendor/dot',
    stapes: 'vendor/stapes'
  }
});
 
require(['app']);