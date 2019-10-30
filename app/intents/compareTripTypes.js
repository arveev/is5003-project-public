const compareTripTypes = request => {
  return agent => {
    const { TripType } = request.body.queryResult.parameters;

    const whyAdventure = `If you like to seek thrill, enjoy heart-racing activities and have a knack for exploring, choose Adventure.`;
    const whyExperience = `If you dislike tourist-beaten paths, are game to try new things and want a learning experience, choose Experience.`;
    const whyGetaway = `If you like being one with nature, want a change of pace and are weary of city life, choose Getaway.`;

    if (TripType.length === 0) {
      agent.add(`${whyAdventure}\n\n${whyExperience}\n\n${whyGetaway}`);
    } else {
      let message = ``;
      if (TripType.indexOf('adventure') >= 0) {
        message = `${message}${whyAdventure}\n\n`;
      }
      if (TripType.indexOf('experience') >= 0) {
        message = `${message}${whyExperience}\n\n`;
      }
      if (TripType.indexOf('getaway') >= 0) {
        message = `${message}${whyGetaway}`;
      }
      agent.add(message);
    }
  };
};

module.exports = compareTripTypes;
