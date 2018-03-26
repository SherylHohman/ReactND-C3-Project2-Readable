import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// Components
import FetchStatus from './FetchStatus';

// action creators
import { fetchCategories} from '../store/categories/actionCreators';

// selectors
import { getFetchStatus } from '../store/categories/selectors';  // category selectors

// selectors, that should be refactored to regular constants
import { getCategoriesArray, getValidCategoryUrls } from '../store/categories/selectors';
// constants/helpers than maybe could be selectors instead
import { getLocFrom, getUrl } from '../store/viewData/selectors';

// helpers and constants
import { HOME, DEFAULT_SORT_BY } from '../store/viewData/constants';
import { computeUrlFromParamsAndRouteName } from '../store/viewData/routes';
import { createCategoryUrlToPathLookup } from '../store/categories/selectors';
import { titleCase } from '../utils/helpers';


export class Categories extends Component {
// TODO refactor to functional component

  clickDisabled(e){
    e.preventDefault();
  }

  render() {

    // fetch initiated from App.js
    if (!this.props.categories) {
      // loading "spinner", fetch failure, or 404
      return (
        <FetchStatus routerProps={ this.props.routerProps }
          fetchStatus={this.props.fetchStatus}
          label={'categories'}
          item={this.props.categories}
          retryCallback={()=>this.props.fetchCategories()}
        />
      );
    }

    const makeCategoryLink = (categoryPath) => {
      // return ROUTES.category.base + categoryPath;
      return computeUrlFromParamsAndRouteName(
                      {categoryPath: categoryPath},
                      'category',
             );
    }

    const isExactPath = (thisCategoryPath) => {
      return (this.props.selectedCategoryPath === thisCategoryPath);
    }

    // console.log('Categories.render, re-rendering..');
    return (
      <div>
        {this.props && this.props.categories &&
            (
              <ul className="nav filter">

                <li key="categories-label-makeSureThisKeyIsUnique"
                        className="no-link"> Category: </li>

                { isExactPath(HOME.category.path) ?
                  (  <NavLink key="disabled-all-categories-makeSureThisKeyIsUnique"
                        to={(HOME.category.path)}
                        className={"selected"}
                        onClick={this.clickDisabled}
                        >
                      <li key="all-categories-makeSureThisKeyIsUnique">
                        All
                      </li>
                    </NavLink>
                  ) : (
                    <NavLink key="navlink-all-categories-makeSureThisKeyIsUnique"
                        to={(HOME.category.path)}
                        >
                      <li key="all-categories-makeSureThisKeyIsUnique">
                        All
                      </li>
                    </NavLink>
                  )
                }

                {this.props.categories.map(category => {
                  if (isExactPath(category.path)) {
                    return (
                      <NavLink key={"disabled-"+category.name}
                        to={makeCategoryLink(category.path)}
                        className="selected"
                        onClick={this.clickDisabled}
                        >
                        <li key={category.name}>
                        {titleCase(category.name)}
                        </li>
                       </NavLink>
                    )
                  }
                  else {
                    return (
                      <NavLink key={"navlink-"+category.name}
                        to={makeCategoryLink(category.path)}
                        >
                        <li key={category.name}>
                        {titleCase(category.name)}
                        </li>
                       </NavLink>
                    )
                  }
                })}

              </ul>
            )
        }
        { (!this.props || !this.props.categories) &&
            <p>No Categories Available</p>
        }
    </div>
    );
  }

}

function mapDispatchToProps(dispatch){
  return ({
    fetchCategories: () => dispatch(fetchCategories()),
  })
}

function mapStoreToProps (store, ownProps) {
  // console.log('Categories.mSTP, store:', store);
  // console.log('Categories, ownProps:', ownProps)

  // this could change..
  const routerProps = ownProps;

  // so can use as an input to getSelectedCategoryPath
  // const getUrl = createSelector(
  //   getLocFrom,  // must call with (null, routerProps) or (store, routerProps)
  //   (loc) => loc.url,
  // );
  // // const url = getUrl(null, routerProps);

  const categoryUrlToPathLookup  = createCategoryUrlToPathLookup(store);
  const getSelectedCategoryPath  = createSelector(
    // getUrl,                     // ( ,routerProps)
    getValidCategoryUrls,       // ()

    (currentUrl, validCategoryUrls) => {
      // verify currentUrl EXACTLY matches a valid Category Url
      let selectedCategoryPath;
      if (currentUrl && (validCategoryUrls.indexOf(currentUrl) !== -1)){
          const matchedUrl = currentUrl;
          selectedCategoryPath = categoryUrlToPathLookup[matchedUrl]
      }
      else {
          // browser is not on a category path, memoise as null
          selectedCategoryPath = null;
      }
      return selectedCategoryPath;
    }
  );
  const selectedCategoryPath = getSelectedCategoryPath(store, routerProps);

  // Do NOT pass routerProps as 2nd parameter!, or anything else as 2nd param!
  const fetchStatus      = getFetchStatus(store);
  const categoriesArray  = getCategoriesArray(store);

  return {
      fetchStatus,
      categories: categoriesArray   || null,
      sortBy: store.viewData.sortBy || DEFAULT_SORT_BY,
      selectedCategoryPath,  // null if not on a valid category URL
  }
};

export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(Categories));


// getSelectedCategoryPath USES ROUTERPROPS to get the most up-to-date categoryPath
  // I Do NOT want to use the categoryPath stored in loc, because it is one page refresh behind,
  //  INITIALLY, and thus requires an extra page render, AFTER the PAGE cDM calls changeView.
  // Cannot use routerProps to read the categoryPath, because this component matches on '/'
  //  thus categoryPath will always be non-existant when called from this component.
  // HENCE, I'm getting the current URL from routerProps.
  //    Then checking to see if the PAGE url is a category URL.
  //    IF so, then must reverse lookup the url to matched category
  //    in order to highlight the selected category.
  //    Actually, *can* call get... from inside isExact function.
  //    But that seems too low level a call to make from inside render.
  //    It's technically fine.  But render should not need to know details on how
  //    routes are created.  Seems better to give this component the item it actually
  //    needs/consumes.  In this case that would be categoryPath, NOT categoryUrl.

// NOTE for USING GETLOC getLoc in CATEGORIES component:
    //  url uses location.pathname instead of match.path
    //
    //  if component "matches" on a non-exact route,
    //  match.path and match.params may NOT reflect the full path
    //  For example, Categories Component is rendered on every path
    //  So (inside Categories) ALWAYS: match.path === '/' match.params === ''
    //    even when browser route is
    //    '/:categories', path '/react', and params is 'categoryPath: react'
    //  SO.. use location.pathname for actual url
    //    BUT.. NOTE params would still be incorrect when inside Categories
    //    - would need to self-parse the url to get the params of the actual url.
    //    Fortunately, params are not CURRENTLY needed in components that
    //    display/match on multiple/non-exact routes
    //    (Categories is the only such component currently)
    //    This Note is for FYI TroubleShooting in case this ever changes.

  // NOTE: unlike other components, do NOT use routerProps for the loc.
  //    this component renders on Every Route, and will always "Match" at route '/'.
  //    thus the routeName in this component would always be 'home', No Matter
  //    what the browser URL sais.
  //    Instead, use viewDate.loc,
  //    This way Categories renders correctly, with correct "selectedCategory"
  //      highlighted.

