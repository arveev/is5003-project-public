const { Image, Suggestion } = require('dialogflow-fulfillment');

const greeting = request => {
  return agent => {
    let message = `Hey! I'm Llama Bot, and I can help you plan a good trip. To begin, can you tell me about your goals for this trip?`;
    agent.add(message);

    const imageUrl = `https://storage.googleapis.com/nus-is5003-project-public-files/llama_bot.png`;
    agent.add(new Image(imageUrl));

    agent.add(new Suggestion(`Explore the world`));
    agent.add(new Suggestion(`Get away from daily life`));
    agent.add(new Suggestion(`Time with family`));
    agent.add(new Suggestion(`Make new friends`));
    agent.add(new Suggestion(`Spend me-time`));
    agent.add(new Suggestion(`Get inspired`));
    agent.add(new Suggestion(`Special occasion`));
  };
};

module.exports = greeting;
