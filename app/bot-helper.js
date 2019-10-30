const saveContext = (agent, context, lifespan, parameters) => {
  agent.setContext({ name: context, lifespan, parameters });
};

const addToContext = (agent, request, context, lifespan, additionalParams) => {
  const existingParams = contextParams(request, context);
  const combinedParams = Object.assign(existingParams, additionalParams);
  agent.setContext({ name: context, lifespan, parameters: combinedParams });
};

const contextParams = (request, contextName) => {
  const outputContexts = request.body.queryResult.outputContexts;
  let parameters = {};
  outputContexts.forEach(oc => {
    const tokens = oc.name.split('/');
    const lastToken = tokens[tokens.length - 1];
    const contextFound = contextName.toLowerCase() === lastToken;
    if (contextFound) parameters = oc.parameters;
  });
  return parameters;
};

const killContext = (agent, contexts) => {
  contexts.forEach(context => {
    agent.setContext({ name: context, lifespan: 0, parameters: {} });
  });
};

const getUserId = agent => {
  if (agent.originalRequest.hasOwnProperty('source')) {
    switch (agent.originalRequest.source) {
      case 'facebook':
        return agent.originalRequest.payload.data.sender.id;
      case 'twilio':
        return agent.originalRequest.payload.data.From; // contains phone number
      case 'google':
        return agent.originalRequest.payload.conversation.conversationId;
      default:
        return 'console';
    }
  }
  return null;
};

module.exports = {
  saveContext,
  addToContext,
  contextParams,
  killContext,
  getUserId
};
