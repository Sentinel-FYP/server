const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

const REGION = process.env.AWS_S3_BUCKET_REGION;
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const ACCESS_KEY_ID = process.env.AWS_SECRET_ACCESS_KEY_ID;
const CLOUDFRONT_ACCESS_KEY_ID = process.env.CLOUDFRONT_ACCESS_KEY_ID;
const CLOUDFRONT_PRIVATE_KEY = process.env.CLOUDFRONT_PRIVATE_KEY;
const CLOUDFRONT_DOMAIN_URL = process.env.CLOUDFRONT_DOMAIN_URL;

const s3 = new AWS.S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: ACCESS_KEY,
  region: REGION,
});

const createPresignedUrl = async (key) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Expires: 3600,
  };

  const preSignedUrl = s3.getSignedUrl("getObject", params);
  return preSignedUrl;
};

const createCloudFrontURL = (key) => {
  const signer = new AWS.CloudFront.Signer(CLOUDFRONT_ACCESS_KEY_ID, CLOUDFRONT_PRIVATE_KEY);

  // 2 hours as milliseconds to use for link expiration
  const twoDays = 2 * 60 * 60 * 1000;
  const resourceURL = CLOUDFRONT_DOMAIN_URL + key;
  console.log(resourceURL);

  const signedUrl = signer.getSignedUrl({
    url: resourceURL,
    expires: Math.floor((Date.now() + twoDays) / 1000),
  });
  return signedUrl;
};

module.exports = { createPresignedUrl, s3, createCloudFrontURL };
