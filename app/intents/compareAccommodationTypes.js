const compareAccommodationTypes = request => {
  return agent => {
    const { AccommodationType } = request.body.queryResult.parameters;

    const whyHostel = `If you like to meet new friends or travel buddies at communal areas, but clean, safe and comfortable enough for a good night's rest, choose Hostel.`;
    const whyHomestay = `If you like to experience the local way of life and the warmth of being in a household, choose Homestay.`;
    const whyHotel = `If you just want absolute comfort and privacy to getting well-rested, choose Hotel.`;

    if (AccommodationType.length === 0) {
      agent.add(`${whyHostel}\n\n${whyHomestay}\n\n${whyHotel}`);
    } else {
      let message = ``;
      if (AccommodationType.indexOf('hostel') >= 0) {
        message = `${message}${whyHostel}\n\n`;
      }
      if (AccommodationType.indexOf('homestay') >= 0) {
        message = `${message}${whyHomestay}\n\n`;
      }
      if (AccommodationType.indexOf('hotel') >= 0) {
        message = `${message}${whyHotel}`;
      }
      agent.add(message);
    }
  };
};

module.exports = compareAccommodationTypes;
