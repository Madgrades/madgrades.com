import React, { Component } from "react";
import { useAppSelector } from "../store/hooks";
import { Dropdown, DropdownProps } from "semantic-ui-react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { stringify } from "qs";

interface SortOption {
  key: string;
  text: string;
  value: string;
}

const sortOptions: SortOption[] = [
  {
    key: "relevance",
    text: "Best Match",
    value: "relevance",
  },
  {
    key: "number",
    text: "Number (Lowest First)",
    value: "number",
  },
  {
    key: "number_desc",
    text: "Number (Highest First)",
    value: "number_desc",
  },
];

interface CourseFilterParams {
  sort?: string;
  order?: string;
  query?: string | null;
  page?: number;
  subjects?: string[];
  instructors?: number[];
  compareWith?: string;
}

interface CourseSortFormProps {
  courseFilterParams: CourseFilterParams;
  navigate: NavigateFunction;
}

interface CourseSortFormState {
  value: string;
}

class CourseSortFormClass extends Component<CourseSortFormProps, CourseSortFormState> {
  state: CourseSortFormState = {
    value: "number",
  };

  componentDidUpdate = (prevProps: CourseSortFormProps): void => {
    if (prevProps.courseFilterParams !== this.props.courseFilterParams) {
      const { sort, order } = this.props.courseFilterParams;
      let value: string;

      if (!sort) {
        value = "relevance";
      } else if (sort === "relevance") {
        value = "relevance";
      } else if (sort === "number") {
        value = "number";
        if (order === "desc") value = "number_desc";
      } else {
        value = "relevance";
      }

      if (value !== this.state.value) {
        this.setState({
          value,
        });
      }
    }
  };

  onChange = (_event: React.SyntheticEvent<HTMLElement>, { value }: DropdownProps): void => {
    this.setState({
      value: value as string,
    });

    let sort: string | undefined, order: string | undefined;

    if (value === "number") {
      sort = "number";
    } else if (value === "number_desc") {
      sort = "number";
      order = "desc";
    } else if (value === "relevance") {
      // nothing to do
    }

    const params = {
      ...this.props.courseFilterParams,
      sort,
      order,
    };
    this.props.navigate("/search?" + stringify(params, { encode: false }));
  };

  render = (): JSX.Element => {
    const { value } = this.state;

    return (
      <Dropdown
        inline
        direction="left"
        header="Sort options"
        options={sortOptions}
        value={value}
        onChange={this.onChange}
      />
    );
  };
}

const CourseSortForm: React.FC = () => {
  const navigate = useNavigate();
  const courseFilterParams = useAppSelector(state => state.app.courseFilterParams);

  return <CourseSortFormClass courseFilterParams={courseFilterParams} navigate={navigate} />;
};

export default CourseSortForm;
