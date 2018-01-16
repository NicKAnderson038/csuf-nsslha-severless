"use strict";

const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.test = (event, context, callback) => {
  const x = process.env.DYNAMODB_TABLE;

  const response = {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    statusCode: 200,
    body: JSON.stringify({
      message: x,
      input: event
    })
  };

  callback(null, response);
};
