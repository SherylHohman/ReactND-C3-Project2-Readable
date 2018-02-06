import expect from 'expect';
// import deepFreeze from 'deep-freeze';
import { titleCase } from './helpers';
import { parseBrowserUrl } from './helpers';

// -------------- titleCase function --------------
// single word
const sampleString0 = 'react';
expect(
  titleCase(sampleString0)
).toEqual(
    'React'
  );

// multiple words
const sampleString1 = 'react category';
expect(
  titleCase(sampleString1)
).toEqual(
    'React Category'
  );

// test string features:
//    multiple words, single character words, multiple character words,
//    multiple spaces between words, punctuation, trailing space
const sampleString2 = 'i love react  ! ';
expect(
  titleCase(sampleString2)
).toEqual(
    'I Love React  ! '
  );

console.log('All "titleCase" tests Passed');
// -----------------------------------------------

// ----------- parseBrowserUrl function ----------
const url = "http://example.com:3000/pathname/?search=test#hash";
expect(
  parseBrowserUrl(url)
).toEqual(
    {
      href:     "http://example.com:3000/pathname/?search=test#hash",
      protocol: "http:",
      hostname: "example.com",
      port:     "3000",
      pathname: "/pathname/",
      search:   "?search=test",
      hash:     "#hash",
      host:     "example.com:3000"
    }
  );
console.log('All "parseBrowserUrl" tests Passed');
// -----------------------------------------------



