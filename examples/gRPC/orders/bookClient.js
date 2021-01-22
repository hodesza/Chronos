const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { ModuleResolutionKind } = require('typescript');
const PROTO_PATH = './order.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

//interceptor 
const bookInterceptor = (options, nextCall) => {
  return new grpc.InterceptingCall(nextCall(options), {
  //start
    start(metadata, listerner, next) {
      //add 1st time stamp
      let meta = new grpc.Metadata();
      if(metadata) {
        console.log(metadata);
        meta = metadata;
        }
      const date = new Date();
      meta.set('ordertimestamp', JSON.stringify(date.getTime()));
      // console.log(meta.get('ordertimestamp'));
      // console.log(meta);
      next(meta, {
        // eslint-disable-next-line no-shadow
        onReceiveMetadata(metadata, next) {
          //add 2nd time stamp
          console.log(metadata);
          next(metadata);
        }
      });
    },
    sendMessage(message, next) {
      next(message);
    },
  });
};



const OrderToBookService = grpc.loadPackageDefinition(packageDefinition).OrderToBook;
const orderClient = new OrderToBookService(
  "localhost:30044",
  grpc.credentials.createInsecure(),
  {interceptors: [bookInterceptor]}
);

module.exports = orderClient;