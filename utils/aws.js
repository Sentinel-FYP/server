const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

const REGION = process.env.AWS_S3_BUCKET_REGION;
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const ACCESS_KEY_ID = process.env.AWS_SECRET_ACCESS_KEY_ID;

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

module.exports = { createPresignedUrl, s3 };
