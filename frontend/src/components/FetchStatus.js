import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// components
import PageNotFound from '../components/PageNotFound';
// constants and helpers
import { HOME } from '../store/viewData/constants';
import { routerPropTypes } from '../store/viewData/selectors';

function FetchStatus(props){
  // console.log('FetchStatus.render, re-rendering..');  // monitor for unnecessary re-renders
  const { isLoading, isFetchFailure }  = props.fetchStatus;
  const label         = props.label         || 'item';
  const id            = props.id            || '';
  const retryCallback = props.retryCallback || null;

  if (isFetchFailure) {
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
      return (
        <div>
          <p>looking for your {label}..</p>
        </div>
      );
  };

  if (!id) {
      return (
        <PageNotFound routerProps={ props.routerProps } />
      );
    };
};

  FetchStatus.propTypes = {
    ...routerPropTypes,
    fetchStatus:   PropTypes.object.isRequired,
    label:         PropTypes.string.isRequired,
    retryCallback: PropTypes.func.isRequired,
    id:            PropTypes.string,
  }


export default FetchStatus
