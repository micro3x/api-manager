var AWS = require('aws-sdk');

const defaultConfig = {
  accessKeyId: '12345',
  secretAccessKey: '12345678',
  endpoint: 'http://192.168.9.11:9000',
  s3ForcePathStyle: true, // needed with minio?
  signatureVersion: 'v4'
}

function createService(config) {
  let s3 = new AWS.S3(config);
  return s3;
}

module.exports = { createService };

