const fs = require('fs')
const path = require('path')
const ImageValidatorStream = require('../')

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
