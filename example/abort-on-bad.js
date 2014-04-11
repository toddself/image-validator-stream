'use strict';

var fs = require('fs');
var path = require('path');
var ImageStreamValidation = require('../index');

function validateThenCopy(src, dst, cb){
  var ext = path.extname(src);
  var isv = new ImageStreamValidation({ext: ext});
  isv.on('error', function(err){
    err.file = dst;
    cb(err);
  });

  var out = fs.createWriteStream(dst).on('end', function(){

    cb();
  });

  fs.createReadStream(src).pipe(isv).pipe(out);
}

validateThenCopy('junk.jpg', 'awesome.jpg', function(err){
  if(err){
    fs.unlink(err.file, function(err){
      if(err){
        console.log(err);
      }
      console.log('oh noes!');
    });
  } else {
    console.log('awyiss');
  }
 });