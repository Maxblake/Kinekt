export const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

export const getCurrentTimeString = () => {
  var currentTime = new Date(),
    hours = currentTime.getHours(),
    minutes = currentTime.getMinutes();

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  var suffix = "AM";
  if (hours >= 12) {
    suffix = "PM";
    hours = hours - 12;
  }
  if (hours == 0) {
    hours = 12;
  }

  return hours + ":" + minutes + " " + suffix;
};
