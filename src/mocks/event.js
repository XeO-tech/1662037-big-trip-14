import { getRandomIntFromRange, getRandomArrayElement} from '../utils.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

const MAX_DESCRIPTION_LENGTH = 5;
const MAX_PHOTOS = 10;
const MAX_OFFERS = 5;

const eventTypes = ['Taxi', 'Bus', 'Train', 'Ship', 'Transport', 'Drive', 'Flight', 'Check-in', 'Sightseeng', 'Restaurant'];

const cities = ['Los Angeles', 'San Francisco', 'Las Vegas'];

const generateDatesAndTime = () => {
  dayjs.extend(duration);
  let time;
  const startDate = dayjs().subtract(getRandomIntFromRange(0,1), 'day').subtract(getRandomIntFromRange(0, 1), 'hour').subtract(getRandomIntFromRange(0, 1) * 10, 'minute');
  const endDate = dayjs().add(getRandomIntFromRange(0,1), 'day').add(getRandomIntFromRange(0, 1), 'hour').add(getRandomIntFromRange(1, 2) * 10, 'minute');
  const difference = dayjs.duration(endDate.diff(startDate));

  switch (true) {
    case difference.days() > 0:
      time = difference.format('DD[D] HH[H] mm[M]');
      break;
    case difference.days() === 0 && difference.hours() > 0:
      time = difference.format('HH[H] mm[M]');
      break;
    default:
      time = difference.format('mm[M]');
  }

  return {
    startDate: startDate.format('DD/MM/YY HH:mm'),
    endDate: endDate.format('DD/MM/YY HH:mm'),
    time,
  };
};

const generateCost = () => Math.floor(Math.random() * getRandomIntFromRange(1, 100)) * 10;

const generateDescription = () => {
  const fullDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
  return fullDescription.split('.').slice(0, getRandomIntFromRange(1, MAX_DESCRIPTION_LENGTH)).join('.') + '.';
};

const generatePhotos = () => new Array(getRandomIntFromRange(1, MAX_PHOTOS)).fill().map(() => `http://picsum.photos/248/152?r=${Math.random()}`);

const generateEventOffersList = (type) => {
  return new Array(getRandomIntFromRange(0, MAX_OFFERS)).fill()
    .map(() => {
      return {
        type,
        name: `OfferName ${getRandomIntFromRange(1,100)}`,
        cost: generateCost(),
      };
    });
};

export const generateEvent = () => {
  const type = getRandomArrayElement(eventTypes);
  const datesAndTime = generateDatesAndTime();

  return {
    type,
    destination: getRandomArrayElement(cities),
    startDate: datesAndTime.startDate,
    endDate: datesAndTime.endDate,
    time: datesAndTime.time,
    cost: generateCost(),
    destinationInfo: {
      description: generateDescription(),
      photos: generatePhotos(),
    },
    offers: generateEventOffersList(type),
  };
};
