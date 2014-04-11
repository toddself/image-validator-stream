'use strict';

var fs = require('fs');
var test = require('tap').test;
var ImageValidationStream = require('../index');

function makeTS(ext){
  var iVS = new ImageValidationStream({ext: ext});
  iVS.on('error', function(){});
  return iVS;
}

test('finds good pngs', function(t){
  var iVS = makeTS('png');
  var fn = 'test.png';
  fs.createReadStream(fn).pipe(iVS).on('end', function(){
    t.ok(iVS.validStream, 'did not error');
    t.end();
  }).pipe(process.stderr);
});

test('finds good gifs (87a)', function(t){
  var iVS = makeTS('gif');
  var fn = 'test.gif';
  fs.createReadStream(fn).pipe(iVS).on('end', function(){
    t.ok(iVS.validStream, 'did not error');
    t.end();
  }).pipe(process.stderr);
});

test('finds good gifs (89a)', function(t){
  var iVS = makeTS('gif');
  var fn = 'test89a.gif';
  fs.createReadStream(fn).pipe(iVS).on('end', function(){
    t.ok(iVS.validStream, 'did not error');
    t.end();
  }).pipe(process.stderr);
});

test('finds good jpgs', function(t){
  var iVS = makeTS('jpg');
  var fn = 'test.jpg';
  fs.createReadStream(fn).pipe(iVS).on('end', function(){
    t.ok(iVS.validStream, 'did not error');
    t.end();
  }).pipe(process.stderr);
});

test('handles ext with a period pre-fixed', function(t){
  var iVS = makeTS('.jpg');
  var fn = 'test.jpg';
  fs.createReadStream(fn).pipe(iVS).on('end', function(){
    t.ok(iVS.validStream, 'did not error');
    t.end();
  }).pipe(process.stderr);
});


test('errors on zero length images', function(t){
  var iVS = makeTS('gif');
  var fn = 'bad.png';
  fs.createReadStream(fn).pipe(iVS).on('end', function(){
    t.ok(!iVS.validStream, 'provided an error');
    t.end();
  }).pipe(process.stderr);
});

test('errors on non-image files', function(t){
  var iVS = makeTS('jpg');
  var fn = 'junk.jpg';
  iVS.on('error', function(e){
    t.ok(e, 'should error');
    t.end();
  });
  fs.createReadStream(fn).pipe(iVS).pipe(process.stderr);
});

test('does not interfere if format is unknown', function(t){
  var iVS = makeTS('txt');
  var fn = 'test.txt';
  fs.createReadStream(fn).pipe(iVS).on('end', function(){
    t.ok(iVS.validStream);
    t.end();
  }).pipe(process.stderr);
});