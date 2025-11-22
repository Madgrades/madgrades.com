import React, { Component } from 'react';
import { connect } from 'react-redux';
import utils from '../utils';
import { RootState, CourseFilterParams } from '../types';
import { Dimmer, Icon, Loader, Pagination } from 'semantic-ui-react';
import { Row, Col } from './Grid';
import CourseSearchResultItem from '../containers/CourseSearchResultItem';
import Div from '../containers/Div';
import * as _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { stringify } from 'qs';

interface CourseSearchResultsProps {
  courseFilterParams: CourseFilterParams;
  navigate: (path: string) => void;
  search?: any;
  actions?: any;
}

class CourseSearchResults extends Component<CourseSearchResultsProps> {
  componentDidUpdate = (prevProps: CourseSearchResultsProps) => {
    const { actions, courseFilterParams } = this.props;

    if (!_.isEqual(courseFilterParams, prevProps.courseFilterParams)) {
      actions.fetchCourseSearch(courseFilterParams, courseFilterParams.page);
    }
  };

  onPageChange = (event: any, data: { activePage: number }) => {
    const { activePage } = data;
    const { courseFilterParams, navigate } = this.props;
    const params = {
      ...courseFilterParams,
      page: activePage,
    };

    // Preserve compareWith parameter if it exists
    if (courseFilterParams.compareWith) {
      params.compareWith = courseFilterParams.compareWith;
    }

    navigate("/search?" + stringify(params));
  };

  renderResults = (results) =>
    results.map((result) => {
      return (
        <div key={result.uuid} style={{ marginBottom: "10px" }}>
          <CourseSearchResultItem result={result} />
        </div>
      );
    });

  render = () => {
    const { isFetching } = this.props;
    const { results, totalPages } = this.props.searchData;

    if (isFetching || (results && results.length > 0)) {
      const { page } = this.props.courseFilterParams;

      return (
        <Dimmer.Dimmable as={Div}>
          <Dimmer active={isFetching} inverted>
            <Loader active={isFetching} inverted inline>
              Loading
            </Loader>
          </Dimmer>
          {this.renderResults(results || [])}
          {results && results.length > 0 && (
            <Row center>
              <Col xs={12}>
                <Pagination
                  onPageChange={this.onPageChange}
                  activePage={page}
                  ellipsisItem={{
                    content: <Icon name="ellipsis horizontal" />,
                    icon: true,
                  }}
                  firstItem={null}
                  lastItem={null}
                  prevItem={{
                    content: <Icon name="angle left" />,
                    icon: true,
                  }}
                  nextItem={{
                    content: <Icon name="angle right" />,
                    icon: true,
                  }}
                  totalPages={totalPages}
                  size="mini"
                  siblingRange={1}
                />
              </Col>
            </Row>
          )}
        </Dimmer.Dimmable>
      );
    }

    return (
      <div>
        <p>No courses were found for your search.</p>
      </div>
    );
  };
}

function mapStateToProps(state: RootState) {
  const { searchQuery, courseFilterParams } = state.app;
  const { page } = courseFilterParams;

  let searchData, isFetching;

  const search = state.courses.search;
  searchData = search.pages && search.pages[page];
  isFetching = search.isFetching;

  return {
    searchQuery,
    courseFilterParams,
    isFetching,
    searchData: searchData || {},
  };
}

// HOC to inject navigate as prop
function withNavigate(Component: React.ComponentType<any>) {
  return function ComponentWithNavigate(props: any) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

const connector = connect(mapStateToProps, utils.mapDispatchToProps);
export default connector(withNavigate(CourseSearchResults));
