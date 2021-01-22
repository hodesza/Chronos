// grpc imports
const grpc = require('@grpc/grpc-js');
const protoLoader = require("@grpc/proto-loader");

// mongodb imports and model imports
// const mongoose = require('mongoose');
require('dotenv').config(); // set up environment variables in .env
const BookModel = require('./bookModel');

// load books proto
const PROTO_PATH = './book.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true
});
const bookProto = grpc.loadPackageDefinition(packageDefinition);
// const 
// create gRPC server and add services
const server = new grpc.Server();
server.addService(bookProto.ProxyToBook.service, {
  addBook: (call, callback) => {
    // get the properties from the gRPC client call
    console.log(call.metadata);
    const date = new Date();
    call.metadata.add('timestamp1', JSON.stringify(date.getTime()))
    call.sendMetadata(call.metadata);
    const { title, author, numberOfPages, publisher, bookID } = call.request;
    // create a book in our book collection
    BookModel.create({
      title,
      author,
      numberOfPages,
      publisher,
      bookID,
    })
    .then((data) => {
      callback(null, {});
    })
    .catch((err) => {
      if (err.code === 11000) {
        callback({
          code: grpc.status.ALREADY_EXISTS,
          details: "BookID already exists"
        })
      }
    })
  },
});

server.addService(bookProto.OrderToBook.service, {
  getBookInfo: (call, callback) => {
    console.log(call.metadata);
    BookModel.findOne({ bookID: call.request.bookID }, (err, data) => {
      callback(null, data);
    })
    },
})

// start server
server.bindAsync("127.0.0.1:30044", grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log("Server running at http://127.0.0.1:30044");
});