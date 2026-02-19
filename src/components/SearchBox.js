import React, { Component } from "react";
import { connect } from "react-redux";
import utils from "../utils";
import { Search, Label } from "semantic-ui-react"; // Imported Label
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { fetchCourseAutocomplete } from "../redux/actions/courses";
import SubjectNameList from "../containers/SubjectNameList"; // Imported SubjectNameList

class SearchBox extends Component {
  state = {
    searchValue: "",
    isDebouncing: false,
  };

  componentDidUpdate = (prevProps) => {
    // when we get an outside search value update, reflect that in the
    // search box via the local state
    if (prevProps.searchQuery !== this.props.searchQuery) {
      this.setState({
        searchValue: this.props.searchQuery,
      });
    }
  };

  performSearch = () => {
    const { searchValue } = this.state;
    this.props.navigate(`/search?query=${searchValue}`);
  };

  handleResultSelect = (e, { result }) => {
    this.setState({ searchValue: result.title });
    this.props.navigate(`/courses/${result.uuid}`);
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ searchValue: value, isDebouncing: true });

    if (value.length < 1) {
      this.setState({ isDebouncing: false });
      return;
    }

    this.debouncedSearch(value);
  };

  debouncedSearch = _.debounce((value) => {
    this.setState({ isDebouncing: false });
    this.props.fetchCourseAutocomplete(value);
  }, 300);

  resultRenderer = ({ title, subjects, number, gpa }) => (
    <div className="search-result-item">
      <div className="result-top">
        <span className="course-title">{title}</span>
        {gpa && (
          <Label
            size="mini"
            color={gpa >= 3.5 ? "green" : gpa >= 3.0 ? "yellow" : "orange"}
            className="gpa-badge"
          >
            GPA: {gpa.toFixed(2)}
          </Label>
        )}
      </div>
      <div className="result-bottom">
        <SubjectNameList subjects={subjects} courseNumber={number} />
      </div>
    </div>
  );

  render = () => {
    const { searchValue } = this.state;
    const { className, style, fluid, size, autoFocus, autocomplete } = this.props;

    const results = autocomplete.results
      ? autocomplete.results
          .map((course) => {
            // Prioritize the main 'name' field as it tends to be the cleanest.
            // Fallback to 'names' array only if 'name' is missing.
            let name = course.name;

            if (!name && course.names && course.names.length > 0) {
              const firstValidName = course.names.filter((n) => n).shift();
              if (firstValidName) {
                name = firstValidName;
              }
            }

            if (!name) name = "(Unknown Title)";

            return {
              title: name,
              subjects: course.subjects || [],
              number: course.number,
              uuid: course.uuid,
              key: course.uuid,
              gpa: course.gpa,
            };
          })
      : [];

    return (
      <Search
        className={`SearchBox ${className || ""} ${size === "huge" ? "huge-input" : ""}`}
        style={style || { minWidth: "250px" }}
        input={{
          icon: {
            name: "search",
            link: true,
            onClick: this.performSearch,
            title: "Perform Search",
          },
          fluid: fluid === undefined ? true : fluid,
          placeholder: this.props.placeholder || "Search..."
        }}
        value={searchValue}
        onSearchChange={this.handleSearchChange}
        onResultSelect={this.handleResultSelect}
        results={results}
        loading={autocomplete.isFetching || this.state.isDebouncing}
        
        // Hide "No Results" message while loading or debouncing
        showNoResults={!(autocomplete.isFetching || this.state.isDebouncing)}
        
        resultRenderer={this.resultRenderer}
        size={size}
        autoFocus={autoFocus}
        // open={false}  <-- This was preventing the results from showing
        // We will let Semantic UI handle open state.
        
        // Semantic UI Search input props are passed via `input` prop object, but `onKeyPress` isn't directly exposed on Search itself easily for Enter key unless passed to input.
        // Let's explicitly pass onKeyPress to the input.
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            this.performSearch();
            event.target.blur();
          }
        }}
      />
    );
  };
}

function mapStateToProps(state) {
  return {
    searchQuery: state.app.searchQuery,
    autocomplete: state.courses.autocomplete || { isFetching: false, results: [] }
  };
}

// HOC to inject navigate as prop
function withNavigate(Component) {
  return function ComponentWithNavigate(props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

const mapDispatchToProps = (dispatch) => ({
  ...utils.mapDispatchToProps(dispatch).actions,
  fetchCourseAutocomplete: (query) => dispatch(fetchCourseAutocomplete(query))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigate(SearchBox));
