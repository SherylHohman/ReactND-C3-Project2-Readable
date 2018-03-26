import React from 'react';
import { Link } from 'react-router-dom';
// conmponents
import PageNotFound from '../components/PageNotFound';
// constants and helpers
import { HOME } from '../store/viewData/constants';

function FetchStatus(props){
  const { isLoading, isFetchFailure }  = props.fetchStatus;
  const label         = props.label         || 'item';
  const id            = props.id            || '';
  const retryCallback = props.retryCallback || null;

  if (isFetchFailure) {
      // console.log('FetchStatus: isFetchFailure', label, id);
      return (
        <div>
          <p>I could not retrieve {label}.</p>
          <p>Either it does not exist..</p>
          <p>..or there was a network error.</p>
          <hr />
          <Link to={HOME.url}>Home Page</Link>
          {
            retryCallback &&
            <button onClick={retryCallback}>Retry</button>
          }
        </div>
      );
  }

  if (isLoading) {
      // console.log('FetchStatus: Loading..:', label, id);
      return (
        <div>
          <p>looking for your {label}..</p>
        </div>
      );
  };

  if (!id) {
    // console.log('FetchStatus.(if !id), label, id:', label, id);
      return (
        <PageNotFound routerProps={ props.routerProps } />
      );
    };
};

export default FetchStatus
