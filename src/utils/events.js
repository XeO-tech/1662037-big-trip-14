export const defineDateTimeFormats = (eventDuration) => {
  switch (true) {
    case eventDuration.days() > 0:
      return {
        durationFormat: 'DD[D] HH[H] mm[M]',
        dateTimeFormat: 'DD/MM/YY HH:mm',
      };
    case eventDuration.days() === 0 && eventDuration.hours() > 0:
      return {
        durationFormat: 'HH[H] mm[M]',
        dateTimeFormat: 'HH:mm',
      };
    default:
      return {
        durationFormat: 'mm[M]',
        dateTimeFormat: 'HH:mm',
      };
  }
};

export const sortByDateAscending = (a, b) => new Date(a) - new Date(b);
export const sortByDateDescending = (a, b) => new Date(b) - new Date(a);
export const sortEventsByStartDateAscending = (events) => [...events].sort((a, b) => sortByDateAscending(a.date_from, b.date_from));
