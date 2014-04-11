'use strict';

var stream = require('readable-stream');
var util = require('util');

var Transform = stream.Transform;

var imgBuffers = {
  jpg: ['FFD8FF'],
  gif: ['474946383761', '474946383961'],
  png: ['89504E470D0A1A0A'],
  default: ['']
};

function checkValid(headers, header){
  for(var i = 0; i < headers.length; i++){
    if(header.substr(0, headers[i].length).toUpperCase() === headers[i]){
      return true;
    }
  }
  return false;
}

function ImageValidatorTransform (opts) {
  if (!(this instanceof ImageValidatorTransform)){
    return new ImageValidatorTransform(opts);
  }

  opts = opts || {};

  Transform.call(this, opts);
  this._ext = opts.ext[0] === '.' ? opts.ext.substr(1, opts.ext.length) : opts.ext;
  if(Object.keys(imgBuffers).indexOf(this._ext) === -1){
    this._ext = 'default';
  }
  this._header = '';
  this._headerMax = imgBuffers[this._ext].reduce(function(acc, header){
    return acc > header.length ? acc : header.length;
  }, 0);
  this.validStream = true;
}

util.inherits(ImageValidatorTransform, Transform);

ImageValidatorTransform.prototype._transform = function (chunk, encoding, cb) {
  this._header += chunk.toString('hex');
  if(this._header.length >= this._headerMax){
    var validHeaders = imgBuffers[this._ext];
    if(!checkValid(validHeaders, this._header)){
      this.validStream = false;
      return cb(new Error('Image stream is invalid'));
    }
  }

  this.push(chunk);
  cb();
};

ImageValidatorTransform.prototype._flush = function(cb){
  if(this._header.length === 0){
    this.validStream = false;
  }
  cb();
};

module.exports = ImageValidatorTransform;