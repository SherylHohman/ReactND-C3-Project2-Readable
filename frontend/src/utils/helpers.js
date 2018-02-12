const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

// TODO: use moment.js to formate dates/times using "relative" option in local timezones

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
};

export function titleCase(str) {
  // doesn't allow for all caps.. or CamelCase words :-/
  return str.toLowerCase().split(' ').map(function(word) {
    if (!word || word.length < 1) {
      console.log('cannot titleCase _'+word+'_');
      return word;
    }
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
}

export function parseBrowserUrl(urlString=window.location){
  //  parseBrowserUrl() will parse the current Browser url (window.location)
  //  parseBrowserUrl(someUrlString) will instead parse `someUrlString`

  let parser = document.createElement('a');
  parser.href = `${urlString}`;
  return {
    href:     parser.href,     // => "http://example.com:3000/pathname/?search=test#hash";
    protocol: parser.protocol, // => "http:"
    hostname: parser.hostname, // => "example.com"
    port:     parser.port,     // => "3000"
    pathname: parser.pathname, // => "/pathname/"
    search:   parser.search,   // => "?search=test"
    hash:   parser.hash,       // => "#hash"
    host:   parser.host        // => "example.com:3000"
  }
};


export function createId(){
  return  Math.random().toString(36).substring(2, 20)
        + Math.random().toString(36).substring(2, 20);
  // Base-36 gives 10 digits plus 26 alphabet characters (lower case)
  //   Start at index 2 to skip the leading zero and decimal point
  //   Use 20 characters
  //   Perhaps not necessary to add; might limit the possibility of getting 0.
}
