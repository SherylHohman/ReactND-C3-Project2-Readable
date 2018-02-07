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

// export function titleCase(someString){
//   let words = someString.split(' ');
//   return words.map((word) => {
//     return word.replace(word[0], word[0].toUpperCase());
//   }).join(' ');
// };

export function titleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    if (!word || word.length < 1) {console.log('_'+word+'_'); return word;}  //
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


// I rewrite these far too often. Dry function
export function getCategoryFromName(categoryName){
    if (!categoryName || categoryName === null || categoryName === ''){
      console.log('error: categoryName is invalid, getCategoryFromName in helpers.js');
      return this.props.categories[0] || categoryName;
    } else {
    return this.props.categories.find((category) => {
      return category.name === categoryName;
    });
  }
};



// These functions transform top level store objects (when they represent arrays)
//  into their array equivalents for props, when (DRY) it's been used > 1x.
//  Simple to write, but DRY: it's even simplier to call a func.
export const pullFromStore = {
  categories: function(store) {
    Object.keys(store.categories).reduce((acc, categoryKey) => {
      return acc.concat([store.categories[categoryKey]]);
    }, []);
  }
}

// This keyboard hurts my finger sooo much.  Strain is building up daily
//  redefine console.log to l
export function l(text){
  console.log(text);
}
