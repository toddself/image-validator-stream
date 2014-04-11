[![build status](https://secure.travis-ci.org/toddself/image-validator-stream.png)](http://travis-ci.org/toddself/image-validator-stream)

# image-validator-stream
Provides a transform stream to inspect the incoming header of an image to detemine if it's a valid image format.

Currently supports:
* jpg
* png
* gif (87a/89a)

## Example
```javascript
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
```
[full example](/examples/abort-on-bad.js)

## Installation

`npm install image-validator-stream`

## License
Copyright © 2014 Todd Kennedy, Licensed under the MIT License

