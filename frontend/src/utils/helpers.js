const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

export function dateMonthYear(unixTimestamp){
    const d = new Date(unixTimestamp);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function timeIn12HourFormat(unixTimestamp){
  const d = new Date(unixTimestamp);

  let minutes = d.getMinutes();
  if (minutes<10){
    minutes = "0" + minutes;
  }

  let hours = d.getHours();
  let suffix = 'AM';
  if (hours >= 12) {
    hours = hours - 12;
    suffix = 'PM';
  }
  return `${hours}:${minutes} ${suffix}`;
}

// TODO: use moment.js to formate dates/times using "relative" option in local timezones
