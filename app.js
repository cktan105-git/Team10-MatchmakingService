const { PersonalizeRuntimeClient, GetRecommendationsCommand } = require("@aws-sdk/client-personalize-runtime");
require('dotenv').config();
var express = require("express");
var app = express();

function initPersonalizeClient() {
    const clientConfig = {
        region: 'ap-southeast-1',
        credentials: {
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY
        }
    };
    const personalizeRuntimeClient = new PersonalizeRuntimeClient(clientConfig);
    return personalizeRuntimeClient;
}

app.get("/recommendation/:userId", (req, res, next) => {
    const client = initPersonalizeClient();
    console.log(client);
    const personalizeParams = {
        campaignArn: process.env.CAMPAIGN_ARN,
        userId: req.params.userId
    };
    const command = new GetRecommendationsCommand(personalizeParams);

    client.send(command).then((data) => {
        console.log(data);
        res.status(200).json({data: {userId: req.params.userId, responseData: data}});
    }, (error) => {
        console.error(error);
        res.status(401).json({error: error});
    });
    
    /*res.status(200).json({userId: req.params.userId});*/
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});