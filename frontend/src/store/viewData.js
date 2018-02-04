export const CHANGE_VIEW = 'CHANGE_VIEW';
export const SELECTED_CATEGORY = 'SELECTED_CATEGORY';
export const SORT_BY = 'SORT_BY';
// export const SORT_ORDER = 'SORT_ORDER'; // Ascending only


// Valid Values
  // Use below to populate the Heading/Sort Options UI
  export const sortMethods = [
    {sortBy: "voteScore", text: 'Highest Votes'},
    {sortBy: "date", text: 'Most Recent'}
  ];

  // TODO: get paths from App.js
  export const routes = [
    {path: '/', label: 'home'}, // or 'posts' ?
    {path: '/', label: 'home'},
    {path: '/', label: 'home'},
    {path: '/', label: 'home'},
    {path: '/', label: 'home'},
  ];

  // "selected" is one of: post.id, comment.id, category.name
  // "url" is an exact path, as per browser window
  // "route" is a route format, where `:` prefix represents a variable name
  // "sortOrder" is "Ascending" or "Descending". Not implemented.


// ACTION CREATORS

  // temporal settings:
  export const changeView = ({ url, selected }) => ({
    type: CHANGE_VIEW,
    url,
    selected,
  })

  // "sticky" settings:
  export const selectedCategory = ({ TODO }) => ({
    type: SELECTED_CATEGORY,
  })

  export const sortOrder = ({ TODO }) => ({
    type: SORT_BY,
  })

  // export const sortOrder = ({  }) => ({
  //   type: SORT_ORDER,
  // })


// DATA, INITIAL, SAMPLE
  const sampleHomePage = {

    // temporal, non-sticky fields
      // Assumes user starts on the home page
      // Better to check the loaded url:
      // When app first loads, read user's starting URL.
    url: '/',      // home page
    selected: '',  // all posts (no category filter)

    // sticky fields
    sortBy: 'none',       // ?? '', null, 'none'
    selectedCategory: ''  // ?? '', null, 'none', 'all-categories'

  }

  // TODO: Uncomment after set directive to not Warn about Unused (this section only)
  // const samplePostOrCommentPage = {
  //   url: '/post',   // also format for edit/new comment or post
  //   filter: '8xf0y6ziyjabvozdd253nd', // post.id; also use for comment.id
  // }
  // const sampleCategoryPage = {
  //   url: '/category',
  //   filter: {
  //     category: 'react',
  //     sortBy: 'votes'
  //   },
  // }

  const initialState = {
    // TODO: set this with data from browser URL
    ...sampleHomePage
  };


function viewData(state=initialState, action){
  switch (action.type) {
    case CHANGE_VIEW:
      return ({
              ...state,
              url: action.url,
              selected: action.selected,
            });
    default:
      return state;
  }
};

export default viewData


//  NOTE, I only need either url OR filter.
//    I'm experimenting to seewhich I prefer.
//    URL prpbably better long term or in a more complex app.
//    In this simple app, `selected` requires less code to reach the data
//    once in mapStateToProps.
//    Also, there may be difficulty pulling Router "location" info from store.
//    And they say it's asynch, so it may not update when expected.
//
//  The other option is to pull it off the history object. or Window object.
//  Finally, this app is simple, so I can "just" pass the url whenever the
//  user clicks a link. That's duplicating logic, but probably easy enough.

//  Tougher question is getting the initial URL when the app is fired up.
//  Or if user types an address into the address bar. Or presses the
//  "back" button.. all the things react-router-dom is giving me !!

//  Really don't want to duplicate Router logic.
//  Best would be to access URL from Router's Source Of Truth.
//  Both these other options could fall out of synch when the address changes, outside a "<Link>" (or push) action from WITHIN my app.



/*  NAMING THOUGHTS..

    url,
    filter: postId, commentId, {category, sortBy}

  // experiment with using both options.
  // Only 1 would be needed (either url, OR filter)

  name of this object to be placed on `store`:
  If I use, or include, `url` as a key/property,
    then "selected" doesn't make sense idiomatically.
    neither does "filter".
    But they *would* work for the name of key *on* the object.

  call this:
    selected, or state, or url or localData, OR localState,
    current, currentData,  appState,  view, , page,  location,  locationState,
    locationData,  selectedData,  filterProps,  transient,  emigrate,  ephemeral,
    stateData, selectedState, currentState, currentData, prop, viewData, componentData,
    ropData, locationData, locationProps, componentProps, viewProps, propsToPass,
    transientProps, transientData, viewData

  `selected` works, or `filter`. Unless I also have a url prop.


//  what happened
CHANGE_LOCATION or CHANGE_VIEW or CHANGE_URL
export const  CHANGE_LOCATION = 'CHANGE_LOCATION';

// UPDATE_CURRENT_FOCUS or UPDATE_CURRENT or CHANGE_VIEW or CHANGE_SELECTED or ..

export const UPDATE_CURRENT_FOCUS

export function changeLocation
export function viewData

*/
