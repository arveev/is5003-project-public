const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  'appx5VdRayuUAG0dY'
);
const { Card, Suggestion } = require('dialogflow-fulfillment');
const { contextParams } = require('../bot-helper');

const travelBooking = request => {
  return agent => {
    const { body } = request;
    const { queryResult } = body;

    const travelBookingContextParams = contextParams(request, 'TravelBooking');
    const { recordId, TripType } = travelBookingContextParams;

    console.log(`TravelBooking context params:`, travelBookingContextParams);

    const {
      allRequiredParamsPresent,
      parameters: slotFillingParams
    } = queryResult;

    const {
      OriginCity,
      DepartureDate,
      TravelRegion,
      ReturnDate,
      FlightTier,
      Adults,
      Children,
      Infants,
      FifteenKgBags,
      TwentyKgBags,
      TwentyfiveKgBags,
      AccommodationType,
      HostelRoomType,
      HomestayHostPreference,
      HomestaySleepingPreference,
      HotelRoomType,
      HotelLuxuryPreference,
      AirportTransferPreference,
      TravelInsurancePreference
    } = slotFillingParams;

    const prompts = {
      TRIP_TYPE: `What type of trip will it be? An adventure, an experience or a getaway?`,
      ORIGIN_CITY: `Where will be you departing from?`,
      DEPARTURE_DATE: `When will you depart from ${OriginCity}?`,
      DESTINATION_REGION: `Which region in the world do you want to travel to? Southeast Asia, Asia, Europe or North America?`,
      RETURN_DATE: `When do you like to return to ${OriginCity} from somewhere in ${TravelRegion}?`,
      FLIGHT_TIER: `Would you like to fly on Budget or Economy? I will select safe airlines only.`,
      ADULT_TRAVELLERS: `How many adult travellers (above 12 years old)?`,
      CHILDREN_TRAVELLERS: `How many children travellers (age 2 to 12)?`,
      INFANT_TRAVELLERS: `How many infant travellers (under 2 years old)?`,
      BUDGET_BAGGAGES: `How many 15kg, 20kg and 25kg baggages will you need? You may have up to 2 baggages in a budget airline.`,
      ECONOMY_BAGGAGES: `How many 15kg, 20kg and 25kg baggages will you need? Each traveller has a 15kg checked baggage included free-of-charge and may have up to 2 baggages.`,
      ACCOMMODATION_TYPE: `Which type of accommodation would you like? A hostel, homestay or hotel?`,
      HOSTEL_ROOM_TYPE: `What type of room for a hostel? A shared dorm, female-only dorm or private dorm?`,
      HOMESTAY_HOST_PREFERENCE: `Would you like to stay with a host or without a host?`,
      HOMESTAY_SLEEPING_PREFERENCE: `What kind of sleeping arrangement do you prefer? A double bed or single beds?`,
      HOTEL_ROOM_TYPE: `What type of room for a hotel? A twin room (2 beds), double room (queen/king-sized bed) or family room (up to 4 people)?`,
      HOTEL_LUXURY_PREFERENCE: `Would you like a luxurious hotel?`,
      AIRPORT_TRANSFERS_PREFERENCE: `Would you be interested in airport transfers booked for you? This will include transfers between cities if you visit multiple cities during your trip.`,
      TRAVEL_INSURANCE_PREFERENCE: `Would you be interested in travel insurance? It covers overseas medical expenses, theft or damage of personal items, baggage delay and travel delay.`
    };

    if (allRequiredParamsPresent) {
      agent.add(
        `OK. Your travel booking request is successfully submitted. I'll contact you shortly with your travel plan. Thank you.`
      );
      agent.add(
        new Card({
          title: `Booking Details`,
          text: `Record ID: ${recordId} |
          Trip type: ${TripType} |
          Route: From ${OriginCity} to somewhere in ${TravelRegion} |
          Period: From ${DepartureDate} to ${ReturnDate} |
          Flight tier: ${FlightTier} |
          Passengers: ${Adults || 0} adults, ${Children ||
            0} children, ${Infants || 0} infants |
          Baggages: ${FifteenKgBags || 0} 15kg bags, ${TwentyKgBags ||
            0} 20kg bags, ${TwentyfiveKgBags || 0} 25kg bags |
          Accommodation: ${AccommodationType} |
          Hostel room type: ${HostelRoomType || 'not applicable'} |
          Stay with host: ${HomestayHostPreference || 'not applicable'} |
          Hostel bed preference: ${HomestaySleepingPreference ||
            'not applicable'} |
          Hotel room type: ${HotelRoomType || 'not applicable'} |
          Luxurious hotel: ${HotelLuxuryPreference || 'not applicable'} |
          Airport transfer: ${AirportTransferPreference || 'not applicable'} |
          Travel insurance: ${TravelInsurancePreference || 'not applicable'}`
        })
      );
    } else {
      if (TripType === '') {
        agent.add(prompts.TRIP_TYPE);
        agent.add(new Suggestion(`Adventure`));
        agent.add(new Suggestion(`Experience`));
        agent.add(new Suggestion(`Getaway`));
      } else if (OriginCity === '') {
        agent.add(prompts.ORIGIN_CITY);
      } else if (DepartureDate === '' && OriginCity !== '') {
        agent.add(prompts.DEPARTURE_DATE);
      } else if (TravelRegion === '') {
        agent.add(prompts.DESTINATION_REGION);
        agent.add(new Suggestion(`Southeast Asia`));
        agent.add(new Suggestion(`Asia`));
        agent.add(new Suggestion(`Europe`));
        agent.add(new Suggestion(`North America`));
      } else if (
        ReturnDate === '' &&
        OriginCity !== '' &&
        TravelRegion !== ''
      ) {
        agent.add(prompts.RETURN_DATE);
      } else if (FlightTier === '') {
        agent.add(prompts.FLIGHT_TIER);
        agent.add(new Suggestion(`Budget`));
        agent.add(new Suggestion(`Economy`));
      } else if (Adults === '') {
        agent.add(prompts.ADULT_TRAVELLERS);
      } else if (Children === '') {
        agent.add(prompts.CHILDREN_TRAVELLERS);
      } else if (Infants === '') {
        agent.add(prompts.INFANT_TRAVELLERS);
      } else if (
        FlightTier.toLowerCase() === 'budget' &&
        ((FifteenKgBags === '0' ||
          FifteenKgBags === 0 ||
          FifteenKgBags === '') &&
          (TwentyKgBags === '0' || TwentyKgBags === 0 || TwentyKgBags === '') &&
          (TwentyfiveKgBags === '0' ||
            TwentyfiveKgBags === 0 ||
            TwentyfiveKgBags === ''))
      ) {
        agent.add(prompts.BUDGET_BAGGAGES);
      } else if (
        FlightTier.toLowerCase() === 'economy' &&
        ((FifteenKgBags === '0' ||
          FifteenKgBags === 0 ||
          FifteenKgBags === '') &&
          (TwentyKgBags === '0' || TwentyKgBags === 0 || TwentyKgBags === '') &&
          (TwentyfiveKgBags === '0' ||
            TwentyfiveKgBags === 0 ||
            TwentyfiveKgBags === ''))
      ) {
        agent.add(prompts.ECONOMY_BAGGAGES);
      } else if (AccommodationType === '') {
        agent.add(prompts.ACCOMMODATION_TYPE);
        agent.add(new Suggestion(`Hostel`));
        agent.add(new Suggestion(`Homestay`));
        agent.add(new Suggestion(`Hotel`));
      } else if (
        AccommodationType.toLowerCase() === 'hostel' &&
        HostelRoomType === ''
      ) {
        agent.add(prompts.HOSTEL_ROOM_TYPE);
        agent.add(new Suggestion(`Shared dorm`));
        agent.add(new Suggestion(`Female-only dorm`));
        agent.add(new Suggestion(`Private dorm`));
      } else if (
        AccommodationType.toLowerCase() === 'homestay' &&
        HomestayHostPreference === ''
      ) {
        agent.add(prompts.HOMESTAY_HOST_PREFERENCE);
        agent.add(new Suggestion(`Stay with host`));
        agent.add(new Suggestion(`Stay without host`));
      } else if (
        AccommodationType.toLowerCase() === 'homestay' &&
        HomestayHostPreference !== '' &&
        HomestaySleepingPreference === ''
      ) {
        agent.add(prompts.HOMESTAY_SLEEPING_PREFERENCE);
        agent.add(new Suggestion(`Double bed`));
        agent.add(new Suggestion(`Single beds`));
      } else if (
        AccommodationType.toLowerCase() === 'hotel' &&
        HotelRoomType === ''
      ) {
        agent.add(prompts.HOTEL_ROOM_TYPE);
        agent.add(new Suggestion(`Twin room`));
        agent.add(new Suggestion(`Double room`));
        agent.add(new Suggestion(`Family room`));
      } else if (
        AccommodationType.toLowerCase() === 'hotel' &&
        HotelRoomType !== '' &&
        HotelLuxuryPreference === ''
      ) {
        agent.add(prompts.HOTEL_LUXURY_PREFERENCE);
        agent.add(new Suggestion(`Add luxurious hotel`));
        agent.add(new Suggestion(`No luxurious hotel`));
      } else if (AirportTransferPreference === '') {
        agent.add(prompts.AIRPORT_TRANSFERS_PREFERENCE);
        agent.add(new Suggestion(`Add airport transfers`));
        agent.add(new Suggestion(`No airport transfers`));
      } else if (TravelInsurancePreference === '') {
        agent.add(prompts.TRAVEL_INSURANCE_PREFERENCE);
        agent.add(new Suggestion(`Add travel insurance`));
        agent.add(new Suggestion(`No travel insurance`));
      } else {
        agent.add(`There are additional parameters that I need.`);
      }
    }

    const airtableRecords = [
      {
        id: recordId,
        fields: {
          trip_type: TripType,
          origin_city: OriginCity,
          departure_date: DepartureDate,
          travel_region: TravelRegion,
          return_date: ReturnDate,
          flight_tier: FlightTier,
          adults: Adults,
          children: Children,
          infants: Infants,
          '15kg_bags': FifteenKgBags,
          '20kg_bags': TwentyKgBags,
          '25kg_bags': TwentyfiveKgBags,
          accommodation_type: AccommodationType,
          hostel_room_type: HostelRoomType,
          stay_with_host: HomestayHostPreference,
          homestay_sleeping_preference: HomestaySleepingPreference,
          hotel_room_type: HotelRoomType,
          luxurious_hotel: HotelLuxuryPreference,
          airport_transfers: AirportTransferPreference,
          travel_insurance: TravelInsurancePreference
        }
      }
    ];

    console.log(`airtableRecords:`, airtableRecords);

    return new Promise((resolve, reject) => {
      const handleError = err => {
        reject(err);
      };

      const handleSuccess = records => {
        resolve(records);
      };

      const promiseHandler = (err, records) => {
        err ? handleError(err) : handleSuccess(records);
      };

      base('Bookings').update(
        airtableRecords,
        { typecast: true },
        promiseHandler
      );
    });
  };
};

module.exports = travelBooking;
