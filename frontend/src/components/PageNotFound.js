import React    from 'react';
import { Link } from 'react-router-dom';
import { HOME } from '../store/viewData/constants';

function PageNotFound (props){
  // console.log('Categories.render, re-rendering..');  // monitor for unnecessary re-renders
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
