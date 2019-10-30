const defaultFallback = request => {
  return agent => {
    agent.add(`Could you try saying it in another way?`);
  };
};

module.exports = defaultFallback;
