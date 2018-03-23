import React    from 'react';
import { Link } from 'react-router-dom';
import { HOME } from '../store/viewData';

function PageNotFound (props){
  return (
    <div style={{margin: 100}}>
      404 PageNotFound
      <Link to={HOME.url}>
        <button>Home Page</button>
      </Link>
    </div>
  );
}

export default PageNotFound
