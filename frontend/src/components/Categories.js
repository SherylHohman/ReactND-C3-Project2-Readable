import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { fetchCategories} from '../store/categories';
// import * as categoriesStore from '../store/categories';
import { ROUTES } from '../store/viewData';
import { changeView, HOME, DEFAULT_SORT_BY } from '../store/viewData';
import { titleCase } from '../utils/helpers';
import { createSelector } from 'reselect';
import { getCategoriesArray, getValidCategoryUrls, getValidCategoryPaths } from '../store/categories';  // category selectors

export class Categories extends Component {

  componentDidMount() {
    // only ever needs tobe called once - they never change for life of the app
    // TODO: already called from App
    //   remove call from here, or remove call from App
    // this.props.fetchCategories();
    // console.log('Categories componentDidMount ..fetching, categories');

  //   // TODO: Probably Delete changeView calls for Categories Component..
  //   console.log('Categories cDM calling changeView, this.props.routerProps', this.props.routerProps);
  //   this.props.changeView(this.props.routerProps)
  }

  componentWillReceiveProps(nextProps){
    // console.log('__Categories cWRP nextProps: ', nextProps);
    // console.log('__Categories cWRP this.Props:', this.props);

    // TODO: if remove from cDM, then remove from here too !
    // this.props.fetchCategories();
    // console.log('Categories.cWRP ..fetching, categories');

    // // TODO: Probably Delete changeView calls for Categories Component..
    // if (this.props.routerProps){
    //   console.log('Categories.cWRP    calling changeView, this.props.routerProps', this.props.routerProps);
    //   this.props.changeView(this.props.routerProps)
    // }
    // else {
    //   console.log('Categories.cWRP NOT calling changeView, this.props.routerProps', this.props.routerProps);
    // }
  }

  clickDisabled(e){
    e.preventDefault();
  }

  render() {
    const makeCategoryLink = (categoryPath) => {
      return ROUTES.category.base + categoryPath;
    }

    const isExactPath = (thisCategoryPath) => {
      // console.log('Categories.isExactPath',
      //             '\nthis.props.selectedCategoryPath', this.props.selectedCategoryPath,
      //             '\nthisCategoryPath', thisCategoryPath
      //             );
      // return this.props.selectedCategoryPath === thisCategoryPath;
      return this.props.loc.url === makeCategoryLink(thisCategoryPath);
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
    changeView: (loc) => dispatch(changeView({ loc })),
  })
}

function mapStoreToProps (store, ownProps) {
  // console.log('Categories.mSTP, store:', store);
  // console.log('Categories.mSTP, store.categories:', store.categories);
  // console.log('Categories.mSTP, store.viewData.loc:', store.viewData.loc);
  // console.log('store.categories:', store.categories)
  // console.log('Categories, ownProps:', ownProps)

  const categoriesArray = getCategoriesArray(store);

  const getSelectedCategoryPath = createSelector(
    store => store.viewData.loc,
    getValidCategoryPaths,
    (loc, validCategoryPaths) => {
      console.log('Categories.mSTP.getSelectedCategoryPath, loc:', loc);
      // if currentUrl EXACTLY matches a valid Category Url
      const categoryPath = (loc && loc.categoryPath)
                            ? loc.categoryPath
                            : null;

      // or use categories.calculateRouteUrlFromLoc()
      if (categoryPath &&
         (validCategoryPaths.indexOf(categoryPath) !== -1) &&
          // future proof validation
          //   in case more ROUTES get added that incorporate :categoryPath (categoryPath)
          (loc.url === ROUTES.category.base + categoryPath)
          ){
        return categoryPath;
      }
      else {
        // memoize any other url as null, to
        //  prevent Categories re-render on a non /:categoryPath route
        //  (because Categories UI displays on ALL pages, not just '/:categoryPath')
        return null;
      }
    }
  );
  const selectedCategoryPath = getSelectedCategoryPath(store);
  // const selectedCategoryPath = store.viewData.loc.categoryPath || null;
  // console.log('__Categories.selectedCategoryPath:', selectedCategoryPath);


  const loc = store.viewData.loc;
  // console.log('Categories.mSTP loc:', loc);

  return {
      categories: categoriesArray   || null,
      sortBy: store.viewData.sortBy || DEFAULT_SORT_BY,
      loc,  //:    store.viewData.loc,    //|| HOME.,
      selectedCategoryPath,  // null if not on a valid category URL (ROUTE.category.path)
  }
};

export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(Categories));
