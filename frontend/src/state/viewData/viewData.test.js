import expect from 'expect';
import deepFreeze from 'deep-freeze';
import viewData from './ducks';


// test: initializing "undefined" state
let state;
let action = {
  type: 'CHANGE_VIEW',
};
// deepFreeze(state);
expect(
  viewData(state, action)
).toEqual({
    url: '/',      // home page
    selected: '',  // all posts (no category filter) // perhaps null is better?
  });


// test missing keys on action object
// state = {abc: 'abc'};
state = {url: '/1', selected: ''};
action = {
  type: 'CHANGE_VIEW',
};
// deepFreeze(state);
expect(
  viewData(state, action)
).toEqual({
    url: '/1',      // home page
    selected: '',  // all posts (no category filter) // perhaps null is better?
  });


// test: ignore data from other actions, adds missing value from state
state = {url: '/2', selected: ''};
action = {
  type: 'SOME_ACTION_I_DONT_CARE_ABOUT',
  url: '/category/react',
  selected: 'react',
};
// deepFreeze(state);
expect(
  viewData(state, action)
).toEqual({
    url: '/2',
    selected: '',
  });


// test: 'CHANGE_VIEW' copies data to state correctly
state = {
  url: '/3',
  selected: ''
};
action = {
  type: 'CHANGE_VIEW',
  url: '/category/react',
  selected: 'react',
};
// deepFreeze(state);
expect(
  viewData(state, action)
).toEqual({
    url: '/category/react',
    selected: 'react',
  });
