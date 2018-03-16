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

export class Categories extends Component {

  componentDidMount() {
    this.props.fetchCategories();
    // console.log('Categories componentDidMount ..fetching, categories');

    // if (this.props.loc){
    //   console.log('Categories cDM calling changeView, this.props.loc', this.props.loc);
    //   this.props.changeView(this.props.loc)
    // }
    // else {  // for app monitoring
    //   console.log('Categories cDM NOT calling changeView, this.props.loc', this.props.loc);
    // }
  }

  componentWillReceiveProps(nextProps){
    // console.log('__Categories cWRP nextProps: ', nextProps);
    // console.log('__Categories cWRP this.Props:', this.props);
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
    // fetchCategories: () => dispatch(categoriesStore.fetchCategories()),
    changeView: (loc) => dispatch(changeView({ loc })),
  })
}

function mapStoreToProps (store, ownProps) {
  // console.log('Categories.mSTP, store:', store);
  // console.log('Categories.mSTP, store.categories:', store.categories);
  // console.log('Categories.mSTP, store.viewData.loc:', store.viewData.loc);
  // console.log('store.categories:', store.categories)
  // console.log('Categories, ownProps:', ownProps)

  // This Component's routerProps will match on '/', so pull loc values from store, DON'T
  //  compute loc from routerProps.
  // const { match, location, history } = ownProps;
  // const routerProps = { match, location, history };
  // // console.log(routerProps);
  // const loc = getLoc(routerProps) || null;
  // console.log('__Categories, loc:', loc);

  const getCategoriesArray = createSelector(
    store => store.categories,
    (categories) => Object.keys(categories).reduce((acc, categoryKey) => {
      return acc.concat([categories[categoryKey]]);
     }, [])
  );
  const categoriesArray = getCategoriesArray(store);
  // const categoriesArray = categoriesStore.getCategoriesArray(store);

  // // this value does not change for the life of the app
  // const getValidCategoryPaths = createSelector(
  //   store => store.categories,
  //   (categories) => Object.keys(categories).reduce((acc, categoryKey) => {
  //     return acc.concat([categories[categoryKey].path]);
  //    }, []).concat(HOME.category.path)
  // );
  // const validCategoryPaths = getValidCategoryPaths(store);
  // const validCategoryPaths = categoriesStore.getValidCategoryPaths(store);

  // const getSelectedCategoryPath = createSelector(
  //   store => store.viewData.loc,
  //   // validCategoryPaths,
  //   getValidCategoryPaths,
  //   (loc, validCategoryPaths) => {
  //     console.log('Categories.mSTP.getSelectedCategoryPath, loc:', loc);
  //     // if currentUrl EXACTLY matches a valid Category Url
  //     // const categoryPath = loc.categoryPath || null;  // null or '' ??
  //     const categoryPath = (loc && loc.categoryPath) ? loc.categoryPath : null;  // null or '' ??

  //     // console.log('__validCategoryPaths', validCategoryPaths);
  //     if ((validCategoryPaths.indexOf(categoryPath) !== -1) &&
  //         // in case more ROUTES get added that incorporate categoryPath (categoryPath)
  //         (loc.url === ROUTES.category.base + categoryPath)
  //         ){
  //       return categoryPath;
  //     }
  //     else {
  //       // any other url memoizes as null, to ensure
  //       //  categories won't re-render on non Categories route
  //       //  (Categories shows on all pages, not just '/:categoryPath')
  //       return null;
  //     }
  //   }
  // );
  // const selectedCategoryPath = getSelectedCategoryPath(store);
  // const selectedCategoryPath = categoriesStore.getSelectedCategoryPath(store);
  const selectedCategoryPath = store.viewData.loc.categoryPath || null;
  // console.log('__Categories.selectedCategoryPath:', selectedCategoryPath);


  const loc = store.viewData.loc;    //|| HOME.,
  // console.log('Categories.mSTP loc:', loc);

  return {
      categories: categoriesArray   || null,
      sortBy: store.viewData.sortBy || DEFAULT_SORT_BY,
      loc,  //:    store.viewData.loc,    //|| HOME.,
      selectedCategoryPath,  // null if not on a valid category URL (ROUTE.category.path)
  }
};

export default withRouter(connect(mapStoreToProps, mapDispatchToProps)(Categories));
