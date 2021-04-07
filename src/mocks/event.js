import { getRandomIntFromRange, getRandomArrayElement} from '../utils.js';
import dayjs from 'dayjs';
import { eventTypes } from '../consts.js';

const MAX_DESCRIPTION_LENGTH = 5;
const MAX_PHOTOS = 2;
const MAX_OFFERS = 5;

const cities = ['Los Angeles', 'San Francisco', 'Las Vegas'];

const generateStartDate = () => dayjs()
  .subtract(getRandomIntFromRange(0,1), 'day')
  .subtract(getRandomIntFromRange(0, 1), 'hour')
  .subtract(getRandomIntFromRange(0, 1) * 10, 'minute')
  .format();

const generateEndDate = () => dayjs()
  .add(getRandomIntFromRange(0, 1), 'hour')
  .add(getRandomIntFromRange(1, 2) * 10, 'minute')
  .format();

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
        name: `Offer ${getRandomIntFromRange(1,100)}`,
        price: generateCost(),
      };
    });
};

export const generateEvent = () => {
  const type = getRandomArrayElement(eventTypes);

  return {
    type,
    destination: getRandomArrayElement(cities),
    startDate: generateStartDate(),
    endDate: generateEndDate(),
    cost: generateCost(),
    destinationInfo: {
      description: generateDescription(),
      photos: generatePhotos(),
    },
    offers: generateEventOffersList(type),
    isFavorite: Boolean(getRandomIntFromRange(0,1)),
  };
};
