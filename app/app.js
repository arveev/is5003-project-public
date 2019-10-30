'use strict';

const { WebhookClient, Suggestion } = require('dialogflow-fulfillment');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

var express = require('express');
const app = express();
const router = express.Router();

router.use(compression());
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(awsServerlessExpressMiddleware.eventContext());

const intents = require('./intents');

router.post('/', (request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  let intentMap = new Map();
  intentMap.set('Greeting', intents.greeting(request));
  intentMap.set('Default Fallback', intents.defaultFallback(request));
  intentMap.set('Travel Motivation', intents.travelMotivation(request));
  intentMap.set('Travel Booking', intents.travelBooking(request));
  intentMap.set('Compare trip types', intents.compareTripTypes(request));
  intentMap.set(
    'Compare accommodation types',
    intents.compareAccommodationTypes(request)
  );
  agent.handleRequest(intentMap);
});

app.use('/', router);

module.exports = app;
