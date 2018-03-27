import { createSelector } from 'reselect';

// SELECTORS
export const getFetchStatus    = (store) => store.comments.fetchStatus;
export const getCommentsObject = (store) => store.comments.fetched;
