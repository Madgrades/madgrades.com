import { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import { RootState, Course, PaginationData, SearchPage, SearchPageWithPagination } from '../types';
import { Dimmer, Icon, Loader, Pagination } from 'semantic-ui-react';
import { Row, Col } from './Grid';
import CourseSearchResultItem from '../containers/CourseSearchResultItem';
import Div from '../containers/Div';
import { useNavigate } from 'react-router-dom';

interface OwnProps {
  navigate: (path: string) => void;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

function CourseSearchResults({
  courseFilterParams,
  navigate,
  actions,
  isFetching,
  searchData,
}: Props) {
  useEffect(() => {
    actions.fetchCourseSearch(courseFilterParams, courseFilterParams.page);
  }, [courseFilterParams, actions]);

  const onPageChange = (_event: React.MouseEvent<HTMLAnchorElement>, data: PaginationData) => {
    const { activePage } = data;
    navigate(
      `/search?${utils.buildQueryString({
        ...courseFilterParams,
        page: activePage,
      })}`
    );
  };

  const renderResults = (results: Course[]) =>
    results.map(result => {
      return (
        <div key={result.uuid} style={{ marginBottom: '10px' }}>
          <CourseSearchResultItem result={result} />
        </div>
      );
    });

  const { results, totalPages } = searchData;

  if (isFetching || results.length > 0) {
    const { page } = courseFilterParams;

    return (
      <Dimmer.Dimmable as={Div}>
        <Dimmer active={isFetching} inverted>
          <Loader active={isFetching} inverted inline>
            Loading
          </Loader>
        </Dimmer>
        {renderResults(results)}
        {results.length > 0 && (
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
}

function mapStateToProps(state: RootState) {
  const { searchQuery, courseFilterParams } = state.app;
  const { page } = courseFilterParams;

  const search = state.courses.search;
  const searchPage = search.pages[page] as SearchPage<Course> | undefined;
  const isFetching = search.isFetching;

  const searchData: SearchPageWithPagination<Course> = searchPage
    ? {
        results: searchPage.results,
        totalCount: searchPage.totalCount,
        totalPages: Math.ceil(searchPage.totalCount / 25),
      }
    : {
        results: [],
        totalCount: 0,
        totalPages: 0,
      };

  return {
    searchQuery,
    courseFilterParams,
    isFetching,
    searchData,
  };
}

// HOC to inject navigate as prop
function withNavigate<P extends object>(Component: React.ComponentType<P>) {
  return function ComponentWithNavigate(props: P) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

const connector = connect(mapStateToProps, utils.mapDispatchToProps);
export default connector(withNavigate(CourseSearchResults));
