import { getRandomIntFromRange, getRandomArrayElement} from '../utils.js';
import dayjs from 'dayjs';

const MAX_DESCRIPTION_LENGTH = 5;
const MAX_PHOTOS = 10;
const MAX_OFFERS = 5;

const eventTypes = ['Taxi', 'Bus', 'Train', 'Ship', 'Transport', 'Drive', 'Flight', 'Check-in', 'Sightseeng', 'Restaurant'];

const cities = ['Los Angeles', 'San Francisco', 'Las Vegas'];

const generetaDateBegins = () => dayjs().subtract(getRandomIntFromRange(1, 10), 'day').format('DD/MM/YY HH:mm');

const generetaDateEnds = () => dayjs().add(getRandomIntFromRange(1, 10), 'day').format('DD/MM/YY HH:mm');

const generateCost = () => Math.floor(Math.random() * getRandomIntFromRange(1, 100)) * 10;

const generateDescription = () => {
  const fullDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
  return fullDescription.split('.').slice(0, getRandomIntFromRange(1, MAX_DESCRIPTION_LENGTH)).join('.') + '.';
};

const generatePhotos = () => new Array(getRandomIntFromRange(1, MAX_PHOTOS)).fill().map(() => `http://picsum.photos/248/152?r=${Math.random()}`);

// Обратите внимание, дополнительные опции — это отдельная структура данных с типом, к которому опция относится, названием и ценой, а не просто массив строк в структуре точки маршрута.
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
  return {
    type: getRandomArrayElement(eventTypes),
    destination: getRandomArrayElement(cities),
    dateBegins: generetaDateBegins(),
    dateEnds: generetaDateEnds(),
    cost: generateCost(),
    destinationInfo: {
      description: generateDescription(),
      photos: generatePhotos(),
    },
    test: function() {
      console.log(this.type);

    },
    // offers: generateEventOffersList(this.type),
  };
};
let d = generateEvent();
console.log(d.test());
