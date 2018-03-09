import { APIGatewayEvent, Callback, Context } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import * as resemble from 'node-resemble-js';
import { PNG } from 'pngjs';
import * as s3tree from 's3-tree';

export class Hello {
  public async go() {





    let s3 = new S3();
    let buckets = await s3.listBuckets().promise();
    let bucketName = 'blue-piggy';
    let generator = s3tree({ bucket: bucketName });

    let ll = await generator.generate('/MY-PROJECT');

    console.log(JSON.stringify(ll));



    let list: S3.ListObjectsOutput = await s3.listObjects({
      Bucket: bucketName
    }).promise();

    if (!list || !list.Contents) throw new Error('no list');

    let projectName = 'MY-PROJECT';
    let buildName = 'BUILD-1';
    list.Contents.forEach(element => {
      //  let regex = new RegExp('/MY-PROJECT\/\S+\.png/g');
      let regex = new RegExp(`${projectName}\/${buildName}\/\\S+\.png`, 'g');
      //  \/MY-PROJECT\/S+.png\/g
      // MY-PROJECT\/BUILD-1\/S+
      let result = regex.exec(element.Key || '');
      if (result != null)
        // console.log(element.Key, ' --- ', result);
        console.log(element.Key);        
    });
    let aa: S3.Object = list.Contents[0];

    // console.log(list);

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
