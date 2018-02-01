const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

export function toPublicationDate(unixTimestamp){
    const d = new Date(unixTimestamp);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function timeIn12HourFormat(d){
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
export function toCommentDateTime(unixTimestamp){
    const d = new Date(unixTimestamp);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${timeIn12HourFormat(d)}`;
}

// TODO: use moment.js to formate dates/times instead of above
