# image-validator-stream

[![build status](https://secure.travis-ci.org/toddself/image-validator-stream.png)](http://travis-ci.org/toddself/image-validator-stream)

Provides a transform stream to inspect the incoming header of an image to detemine if it's a valid image format.

Currently supports:
* jpg
* png
* gif (87a/89a)

## Example

```js
const fs = require('fs')
const path = require('path')
const ImageValidatorStream = require('image-validator-stream')

function validateThenCopy (src, dst, cb) {
  const ext = path.extname(src)
  const ivs = new ImageValidatorStream({ext: ext})
  ivs.on('error', function (err) {
    err.file = dst
    cb(err)
  })

  const out = fs.createWriteStream(dst).on('end', function () {
    cb()
  })

  fs.createReadStream(src).pipe(ivs).pipe(out)
}

validateThenCopy(path.join(__dirname, 'junk.jpg'), 'awesome.jpg', function (err) {
  if (err) {
    fs.unlink(err.file, function (err) {
      if (err) {
        console.log(err)
      }
      console.log('oh noes!')
    })
  } else {
    console.log('awyiss')
  }
})
```

[full example](example/abort-on-bad.js)

## Installation

`npm install image-validator-stream`

## License
Copyright © 2014 Todd Kennedy, Licensed under the [MIT License](LICENSE)
