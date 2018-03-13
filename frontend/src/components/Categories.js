import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { fetchCategories } from '../store/categories';
import { ROUTES } from '../store/viewData';
import { changeView, HOME, DEFAULT_SORT_BY, getUri } from '../store/viewData';
import { titleCase } from '../utils/helpers';
import { createSelector } from 'reselect';

export class Categories extends Component {

  componentDidMount() {
    this.props.fetchCategories();
    console.log('Categories componentDidMount ..fetching, categories');

    if (this.props.uri){
      console.log('Categories cDM calling changeView, this.props.uri', this.props.uri);
      this.props.changeView(this.props.uri)
    }
    // else {  // for app monitoring
    //   console.log('Categories cDM NOT calling changeView, this.props.uri', this.props.uri);
    // }
  }

  componentWillReceiveProps(nextProps){
    // console.log('__Categories cWRP nextProps: ', nextProps);
    // console.log('__Categories cWRP this.Props:', this.props);
  }

  render() {
    const makeCategoryLink = (categoryPath) => {
      return ROUTES.category.base + categoryPath;
    }

    const isExactPath = (thisCategoryPath) => {
      return this.props.selectedCategoryPath === thisCategoryPath;
    }

    // Note: NavLink can apply a different class when the current URL matches
      //  the NavLink item (so the link LOOKS different - eg: cursor and highlighting)
      //  BUT it will NOT DISABLE the link
      //  AND css isDisabled NOT LET me set the cursor (thus it still LOOKS like a link)
      //  THAT'S WHY I'm hand writing <li> "Links" for the selected Category
      //  ..Unfortunately, this is adding an extra space in front of every LINK
      //    that PRECEEDS the Selected "Link" causing the text to shift
      //    depending on which "Link: is selected.
      //    Observe: as select Links one-by-one from L to R,
      //    text accumulates an additional shifted space,
      //    shifting Links from Current to EndOfList a bit further to the right
      //    TODO: how to fix ??
      //      - Already tried wrapping in div..
      //      - And CSS Computed Properties LOOK the SAME No Matter Which Link is Selected !!

    return (
      <div>
        {this.props && this.props.categories &&
            (
              <ul className="nav filter">

                <li key="categories-label-makeSureThisKeyIsUnique"
                        className="no-link"> Category: </li>

                { isExactPath(HOME.category.path) ?
                  ( <li key="disabled-all-categories-makeSureThisKeyIsUnique"
                        className = "selected"
                        aria-current="true" /* to mimic what NavLink does */
                        >
                        All
                    </li>
                  ) : (
                    <NavLink key="navlink-all-categories-makeSureThisKeyIsUnique"
                        to={(HOME.category.path)}
                        activeClassName={"selected"}
                        isActive={isExactPath}
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
                      <div key={'div-disabled-'+category.name}
                        className = "selected"
                        aria-current="true" /* to mimic what NavLink does */
                        >
                        <li key={'disabled-'+category.name}>
                        {titleCase(category.name)}
                        </li>
                      </div>
                    )
                  }
                  else {
                    return (
                      <NavLink key={"navlink-"+category.name}
                        to={makeCategoryLink(category.path)}
                        activeClassName="selected"
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
    changeView: (uri) => dispatch(changeView({ uri })),
  })
}

function mapStoreToProps (store, ownProps) {
  // console.log('store.categories:', store.categories)
  // console.log('Categories, ownProps:', ownProps)

  const { match, location, history } = ownProps;
  const routerProps = { match, location, history };
  // console.log(routerProps);
  const uri = getUri(routerProps) || null;
  // console.log('__Categories, uri:', uri)

  const getCategoriesArray = createSelector(
    store => store.categories,
    (categories) => Object.keys(categories).reduce((acc, categoryKey) => {
      return acc.concat([categories[categoryKey]]);
     }, [])
  );
  const categoriesArray = getCategoriesArray(store);

  const getSelectedCategoryPath = createSelector(
    store => store.viewData.currentId,
    store => store.categories,
    store => store.viewData.currentUrl,
    (currentId, categories, url) => {
      // currentUrl exactly matches a valid Category Url
      const getCategoriesPaths = createSelector(
        store => store.categories,
        (categories) => Object.keys(categories).reduce((acc, categoryKey) => {
          return acc.concat([categories[categoryKey].path]);
         }, []).concat(HOME.category.path)
      );
      const categoriesPaths = getCategoriesPaths(store);
      // console.log('__categoriesPaths', categoriesPaths);

      if ((categoriesPaths.indexOf(currentId) !== -1) &&
          // in case more ROUTES get added that incorporate categoryPath (currentId)
          (url === ROUTES.category.base + currentId)
          ){
        return currentId;
      }
      else {
        // any other url memoizes as null, so
        //  categories won't re-render on non Categories route
        //  (Categories shows on all pages, not just '/:categoryPath')
        return null;
      }
    }
  );
  const selectedCategoryPath = getSelectedCategoryPath(store);
  // console.log('__selectedCategoryPath', selectedCategoryPath);

  return {
      categories: categoriesArray   || null,
      sortBy: store.viewData.sortBy || DEFAULT_SORT_BY,
      uri,
      selectedCategoryPath,  // null if not on a valid category URL (ROUTE.category.path)
  }
};

export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(Categories));
