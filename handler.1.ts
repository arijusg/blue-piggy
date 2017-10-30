import { APIGatewayEvent, Callback, Context } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import * as S3S from 's3-streams';
import * as resemble from 'node-resemble-js';
import { PNG } from 'pngjs'
export class Hello {
  public async go() {

    let s3 = new S3();
    let buckets = await s3.listBuckets().promise();
    let bucketName = 'blue-piggy';
    let list = await s3.listObjects({
      Bucket: bucketName
    }).promise();

    // console.log(list);

    let img = await s3.getObject({
      Bucket: bucketName,
      Key: 'img1.png'
    }).promise();


    let img2 = await s3.getObject({
      Bucket: bucketName,
      Key: 'img2.png'
    }).promise();
    //console.log(img);

    let diffPromise = new Promise((resolve, reject) => {
      var diff = resemble(img.Body)
        .compareTo(img2.Body)
        .ignoreColors()
        .onComplete((data) => {
          resolve(data);
        });
    });

    let result = await diffPromise;
    // console.log(result);
    let r = result as any;
    var buffer = PNG.sync.write(r);
    console.log(buffer);

    //PNG.
    // let diff = r.getDiffImage().pack().pipe((dada)=>{
    //   console.log('dada ', dada);
    // });

    // let gg = r.getBuffer();
    // console.log(r);
    // let b = new Buffer(diff);
    // console.log('--- ', b);
    //let buff = diff._packer._deflate._buffer;

    //    console.log(diff._packer._deflate._buffer);

    // let bb = diff._packer._deflate._writableState.getBuffer();
    // let bb = diff._packer._deflate._readableState.buffer;
    // let bb = diff._parser.read();    


    // console.log(diff.data);

    let p = await s3.putObject({
      Bucket: bucketName,
      Key: 'img-diff.png',
      Body: buffer,
      ACL: 'public-read'
    }).promise();

    //   console.log('p ', p);
    // const data = await resemble.compare(img.Body, img2.Body);
    // console.log(data);

    //   var diff = resemble(img.Body).compareTo(img2.Body).ignoreColors().onComplete(function(data){
    //     console.log(data);
    //     /*
    //     {
    //       misMatchPercentage : 100, // %
    //       isSameDimensions: true, // or false
    //       dimensionDifference: { width: 0, height: -1 }, // defined if dimensions are not the same
    //       getImageDataUrl: function(){}
    //     }
    //     */
    //     let aa = data.getDiffImageAsJPEG();
    //     await s3.putObject({
    //       Bucket: bucketName,
    //       Body: aa,
    //       Key: 'img3.jpeg'
    //     }).promise();
    //     console.log(aa);
    // });

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
