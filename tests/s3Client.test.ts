const { mockClient } = require("aws-sdk-client-mock");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { handler } = require("../src/s3Client");

describe("Lambda Function Tests", () => {
  const s3Mock = mockClient(S3Client);

  beforeEach(() => {
    s3Mock.reset();
  });

  it("should return success message when file is uploaded", async () => {
    s3Mock.on(PutObjectCommand).resolves({});

    const response = await handler({ key: "test.txt", body: "Test content" });

    expect(response).toEqual({
      statusCode: 200,
      body: "File uploaded successfully",
    });
    expect(s3Mock.calls()).toHaveLength(1);
    expect(s3Mock.call(0).args[0].input).toEqual({
      Bucket: "my-bucket",
      Key: "test.txt",
      Body: "Test content",
    });
  });

  it("should return error message when upload fails", async () => {
    s3Mock.on(PutObjectCommand).rejects(new Error("S3 error"));

    const response = await handler({ key: "test.txt", body: "Test content" });

    expect(response).toEqual({
      statusCode: 500,
      body: "Failed to upload file",
    });
  });
});
