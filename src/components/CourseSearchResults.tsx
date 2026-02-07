import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCourseSearch } from "../store/slices/coursesSlice";
import { Dimmer, Icon, Loader, Pagination, PaginationProps } from "semantic-ui-react";
import { Row, Col } from "./Grid";
import CourseSearchResultItem from "../containers/CourseSearchResultItem";
import Div from "../containers/Div";
import * as _ from "lodash";
import { useNavigate } from "react-router-dom";
import { stringify } from "qs";
import { Course } from "../types/api";

const CourseSearchResults: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const courseFilterParams = useAppSelector(state => state.app.courseFilterParams);
  const search = useAppSelector(state => state.courses.search);
  
  const page = courseFilterParams.page || 1;
  const searchData = search.pages?.[page];
  const isFetching = search.isFetching;

  useEffect(() => {
    dispatch(fetchCourseSearch({ params: courseFilterParams, page }));
  }, [dispatch, courseFilterParams, page]);

  const onPageChange = (_event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
    const { activePage } = data;
    const params = {
      ...courseFilterParams,
      page: activePage as number,
    };

    if (courseFilterParams.compareWith) {
      params.compareWith = courseFilterParams.compareWith;
    }

    navigate("/search?" + stringify(params));
  };

  const renderResults = (results: Course[]) =>
    results.map((result) => {
      return (
        <div key={result.uuid} style={{ marginBottom: "10px" }}>
          <CourseSearchResultItem result={result} />
        </div>
      );
    });

  const results = searchData?.results;
  const totalPages = searchData ? Math.ceil(searchData.total / searchData.perPage) : 1;

  if (isFetching || (results && results.length > 0)) {
    return (
      <Dimmer.Dimmable as={Div}>
        <Dimmer active={isFetching} inverted>
          <Loader active={isFetching} inverted inline>
            Loading
          </Loader>
        </Dimmer>
        {renderResults(results || [])}
        {results && results.length > 0 && (
          <Row center>
            <Col xs={12}>
              <Pagination
                onPageChange={onPageChange}
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

export default CourseSearchResults;
