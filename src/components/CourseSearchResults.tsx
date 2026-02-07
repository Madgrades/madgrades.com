import React, { Component } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCourseSearch } from "../store/slices/coursesSlice";
import { Dimmer, Icon, Loader, Pagination, PaginationProps } from "semantic-ui-react";
import { Row, Col } from "./Grid";
import CourseSearchResultItem from "../containers/CourseSearchResultItem";
import Div from "../containers/Div";
import * as _ from "lodash";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { stringify } from "qs";
import { Course } from "../types/api";

interface CourseFilterParams {
  page?: number;
  compareWith?: string;
  query?: string;
  subjects?: string[];
  instructors?: number[];
  sort?: string;
  order?: 'asc' | 'desc';
}

interface SearchData {
  results?: Course[];
  totalPages?: number;
}

interface CourseSearchResultsProps {
  courseFilterParams: CourseFilterParams;
  navigate: NavigateFunction;
  isFetching: boolean;
  searchData: SearchData;
  dispatch: ReturnType<typeof useAppDispatch>;
}

class CourseSearchResultsClass extends Component<CourseSearchResultsProps> {
  componentDidUpdate = (prevProps: CourseSearchResultsProps): void => {
    const { dispatch, courseFilterParams } = this.props;

    if (!_.isEqual(courseFilterParams, prevProps.courseFilterParams)) {
      dispatch(fetchCourseSearch({ params: courseFilterParams, page: courseFilterParams.page || 1 }));
    }
  };

  onPageChange = (_event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
    const { activePage } = data;
    const { courseFilterParams, navigate } = this.props;
    const params = {
      ...courseFilterParams,
      page: activePage as number,
    };

    if (courseFilterParams.compareWith) {
      params.compareWith = courseFilterParams.compareWith;
    }

    navigate("/search?" + stringify(params));
  };

  renderResults = (results: Course[]) =>
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
                  activePage={page || 1}
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

const CourseSearchResults: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const courseFilterParams = useAppSelector(state => state.app.courseFilterParams);
  const search = useAppSelector(state => state.courses.search);
  
  const page = courseFilterParams?.page || 1;
  const searchData = search.pages?.[page] || {};
  const isFetching = search.isFetching;

  return (
    <CourseSearchResultsClass
      courseFilterParams={courseFilterParams}
      navigate={navigate}
      isFetching={isFetching}
      searchData={searchData}
      dispatch={dispatch}
    />
  );
};

export default CourseSearchResults;
