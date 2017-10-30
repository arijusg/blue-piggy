import { APIGatewayEvent, Callback, Context } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import * as resemble from 'node-resemble-js';
import { PNG } from 'pngjs';

export class Hello {
  public async go() {

    let s3 = new S3();
    let buckets = await s3.listBuckets().promise();
    let bucketName = 'blue-piggy';
    let list = await s3.listObjects({
      Bucket: bucketName
    }).promise();

    let img = await s3.getObject({
      Bucket: bucketName,
      Key: 'img1.png'
    }).promise();


    let img2 = await s3.getObject({
      Bucket: bucketName,
      Key: 'img2.png'
    }).promise();

    let diffPromise = new Promise((resolve, reject) => {
      var diff = resemble(img.Body)
        .compareTo(img2.Body)
        .ignoreColors()
        .onComplete((data) => {
          resolve(data);
        });
    });

    let result = await diffPromise as any;
    let rr = result.getDiffImage();
    let options = { colorType: 6 };
    let buffer = PNG.sync.write(rr);

    await s3.putObject({
      Bucket: bucketName,
      Body: buffer,
      Key: 'img3.png',
      ACL: 'public-read',
      ContentType: 'image/png'
    }).promise();
  }
}

export async function hello(event: APIGatewayEvent, context: Context, cb: Callback) {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
      input: 'event',
    }),
  };
  let hello = new Hello();
  await hello.go();

  cb(null, response);
}
