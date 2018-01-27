export const CHANGE_VIEW = 'CHANGE_VIEW';


// ACTION CREATORS
export const changeView = ({ url, selected }) => ({
    type: CHANGE_VIEW,
    url,
    selected,
  })


// DATA, INITIAL, SAMPLE
  const sampleHomePage = {
    // probably a bad idea to assume user starts on the home page
    url: '/',      // home page
    selected: '',  // all posts (no category filter)
    // should probably check the loaded url.
    // When app first loads, need to read user's starting URL. Otherwise
    // opening up a saved link sends the user to the home page instead.
  }

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


//  NOTE, I only need either url OR filter.  I'm experimenting to see
//    which I prefer. URL prpbably better long term or in a more complex app.
//    in this simple app, selected requires less code to reach the data
//    once in mapStateToProps.
//    also, there may be difficulty pulling Router "location" info from
//    store.  And they say it's asynch, so it may not update when expected.
//  the other option is to pull it off the history object. or Window object.
//  Finally, this app is simple, so I can "just" pass the url whenever the
//  user clicks a link. That's duplicating logic, but probably easy enough.
//  Tougher question is getting the initial URL when the app is fired up.
//  Or if user types an address into the address bar. Or presses the
//  "back" button.. all the things react-router-dom is giving me !!
//  Really don't want to duplicate Router logic.
//  Best would be to access URL from Router's Source Of Truth.
//  Both these other options could fall out of synch when the address changes, outside a "<Link>" (or push) action from WITHIN my app.


/*  Thoughts..
url,
filter: postId, commentId, {category, sortBy}

// experiment with using both options. Only 1 would be needed (either url, OR filter)

fileName and name of this object on the `store`:
if use or include `url` as a key/property,
  then "selected" doesn't make sense idiomatically.
  neither does "filter". But they could be the key for 1 field *on* the this object.

call this selected, or state, or url or localData, OR localState,  current, currentData,  appState,  view, , page,  location,  locationState,  locationData,  selectedData,  filterProps,  transient,  emigrate,  ephemeral, stateData, selectedState, currentState, currentData, prop, viewData, componentData, propData, locationData, locationProps, componentProps, viewProps, propsToPass, transientProps, transientData, viewData

selected works, or filter. but not if I add in or use url.

//  what happened
CHANGE_LOCATION or CHANGE_VIEW or CHANGE_URL
export const  CHANGE_LOCATION = 'CHANGE_LOCATION';

// UPDATE_CURRENT_FOCUS or UPDATE_CURRENT or CHANGE_VIEW or CHANGE_SELECTED or ..

export const UPDATE_CURRENT_FOCUS

export function changeLocation
export function viewData

*/
