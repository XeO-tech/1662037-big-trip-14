export const getRandomArrayElement = (array) => array[Math.floor(Math.random() * array.length)];

export const getRandomIntFromRange = (min, max) => Math.round(Math.random() * Math.abs(max - min) + ((min < max) ? min : max));

export const updateItem = (items, updatedItem) => {
  const index = items.findIndex((item) => item.id === updatedItem.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    updatedItem,
    ...items.slice(index + 1),
  ];
};
