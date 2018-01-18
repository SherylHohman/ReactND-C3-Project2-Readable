// ACTION TYPES
  export const LOGIN_USER = 'LOGIN_USER';
  // export const GET_ALL_USERS = 'GET_ALL_USERS';
  // export const ADD_USER = 'ADD_USER';
  // export const DELETE_USER = 'DELETE_USER';

// ACTION CREATORS
  export function loginUser(username) {
    return ({
      type: LOGIN_USER,
      username,
    })
  };

// SAMPLE DATA
  const userInitialState = {
    username: 'Sheryl',
  };

// INITIAL STATE
  const userInitialState = {
    username: '',
  };

// REDUCER(s)
  function user(state=sampleUser, action) {
    switch (action.type){
      case LOGIN_USER:
        // action data should be an object of post objects, ie user object)
        // when fetch user from database is successful, add to store
        return ({
          ...state,
          username: action.username,
        });
      default:
        return state;
    }
  }


export default user
