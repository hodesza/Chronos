/* eslint-disable no-console */
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { ModuleResolutionKind } = require('typescript');
const PROTO_PATH = './reverseProxy.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true
});

// interceptor

const bookInterceptor = (options, nextCall) => {
  return new grpc.InterceptingCall(nextCall(options), {
  //start
    start(metadata, listerner, next) {
      //add 1st time stamp
      let meta = new grpc.Metadata();
      const date = new Date();
      meta.set('timestamp1', JSON.stringify(date.getTime()));
      console.log(meta.get('timestamp1'));
      console.log(meta);
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

const ProxyToBookService = grpc.loadPackageDefinition(packageDefinition).ProxyToBook;
const bookClient = new ProxyToBookService(
    "localhost:30044",
    grpc.credentials.createInsecure(),
    {interceptors: [bookInterceptor]}
);


module.exports = bookClient;