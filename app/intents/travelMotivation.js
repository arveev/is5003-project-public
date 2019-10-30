const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  'appx5VdRayuUAG0dY'
);
const { Suggestion } = require('dialogflow-fulfillment');
const { describeArray } = require('../util');
const { addToContext, getUserId } = require('../bot-helper');

const travelMotivation = request => {
  return agent => {
    let { Travel_Motivation } = request.body.queryResult.parameters;

    agent.setContext({
      name: 'TravelBooking',
      lifespan: 7,
      parameters: { Travel_Motivation }
    });

    if (Travel_Motivation.length > 0) {
      agent.add(
        `Just like you, I love to ${describeArray(
          Travel_Motivation
        )} too.\n\nAre you thinking of an adventure, an experience or a getaway?`
      );
    } else {
      agent.add(
        `OK. Please describe your trip details. For example, you can tell me whether you are thinking of an adventure, an experience or a getaway.`
      );
    }

    agent.add(new Suggestion(`Adventure`));
    agent.add(new Suggestion(`Experience`));
    agent.add(new Suggestion(`Getaway`));

    return new Promise((resolve, reject) => {
      const user_id = getUserId(agent) || '';
      const travel_motivations = describeArray(Travel_Motivation);
      const airtableRecords = [{ fields: { user_id, travel_motivations } }];

      const promiseHandler = (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
          const recordId = records[0].getId();
          addToContext(agent, request, 'TravelBooking', 20, { recordId });
        }
      };

      base('Bookings').create(airtableRecords, promiseHandler);
    });
  };
};

module.exports = travelMotivation;
