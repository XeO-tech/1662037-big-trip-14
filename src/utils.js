export const getRandomArrayElement = (array) => array[Math.floor(Math.random() * array.length)];

export const getRandomIntFromRange = (min, max) => Math.round(Math.random() * Math.abs(max - min) + ((min < max) ? min : max));
