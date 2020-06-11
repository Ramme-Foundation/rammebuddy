var moment = require('moment');

export const getCurrentWeekNumber = () =>
  moment(Date.now()).isoWeek() as number;
