
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { ModuleResolutionKind } = require('typescript');
const PROTO_PATH = './reverseProxy.proto';

// interceptor
const interceptor = (options, nextCall) => {
  return new grpc.InterceptingCall(nextCall(options), {
  //start
    start(metadata, listerner, next) {
      //add 1st time stamp
      let meta = new grpc.Metadata();
      const date = new Date();
      meta.set('timestamp1', JSON.stringify(date.getTime()));
      // console.log(meta.get('timestamp1'));
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


const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

/**
 * Proxy to Order
 */
const ProxyToOrderService = grpc.loadPackageDefinition(packageDefinition).ProxyToOrder;
const orderClient = new ProxyToOrderService(
  "localhost:30043",
  grpc.credentials.createInsecure(),
 {interceptors: [interceptor]}
);



module.exports = orderClient;
