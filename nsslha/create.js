"use strict";

const uuid = require("uuid");
const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (
    typeof data.Name !== "string" ||
    typeof data.Email !== "string" ||
    typeof data.Phone !== "string" ||
    typeof data.Nsslha !== "boolean" ||
    typeof data.Csha !== "boolean" ||
    typeof data.Attendance !== "string"
  ) {
    console.error("Validation Failed");
    callback(new Error("Couldn't create the item."));
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      Name: data.Name,
      Email: data.Email,
      Phone: data.Phone,
      Nsslha: data.Nsslha,
      Csha: data.Csha,
      Attendance: data.Attendance,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  };

  dynamoDb.put(params, error => {
    if (error) {
      console.error(error);
      callback(new Error("Couldn't create the item."));
      return;
    }

    const response = {
      headers: {
        // "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      statusCode: 200,
      body: JSON.stringify(params.Item)
    };
    callback(null, response);
  });
};
