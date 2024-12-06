const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client();

exports.handler = async (event) => {
  const bucketName = "my-bucket";
  const key = event.key;
  const body = event.body;

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: body,
      })
    );
    return { statusCode: 200, body: "File uploaded successfully" };
  } catch (error) {
    return { statusCode: 500, body: "Failed to upload file" };
  }
};
