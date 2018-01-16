"use strict";

const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  if (typeof data.userName !== "string" || typeof data.userEmail !== "string") {
    console.error("Validation Failed");
    callback(new Error(`Couldn't update the item.`));
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id
    },
    ExpressionAttributeValues: {
      ":userName": data.userName,
      ":userEmail": data.userEmail,
      ":checked": data.checked,
      ":updatedAt": timestamp
    },
    UpdateExpression:
      "SET userName = :userName, userEmail = :userEmail, updatedAt = :updatedAt",
    ReturnValues: "ALL_NEW"
  };

  dynamoDb.update(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error("Couldn't update the item."));
      return;
    }

    const response = {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      statusCode: 200,
      body: JSON.stringify(result.Attributes)
    };
    callback(null, response);
  });
};
