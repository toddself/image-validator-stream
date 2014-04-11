# image-validator-stream
Provides a transform stream to inspect the incoming header of an image to detemine if it's a valid image format.

Currently supports:
* jpg
* png
* gif (87a/89a)

## Usage
```javascript
> var ImageValidatorStream  = require('image-validator-stream');
> ImageValidatorStream.on('error', function(error){
  console.error('Invalid image');
});

> var imgValidStm = new ImageValidatorStream({ext: 'jpg'});
> fs.createReadStream('test/junk.jpg').pipe(imgValidStm).pipe(fs.createWriteStream('test/out.jpg'));
"Invalid image"
> imgValidStm.validStream
false
```

## License
Copyright © 2014 Todd Kennedy, Licensed under the MIT License
