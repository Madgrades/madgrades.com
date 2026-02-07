import React, { Component } from "react";
import { useAppSelector } from "../store/hooks";
import { Button, Divider, Form, Input, InputOnChangeData } from "semantic-ui-react";
import EntitySelect from "./EntitySelect";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { stringify } from "qs";
import * as _ from "lodash";
import { CourseFilterParams } from "../types/api";

interface CourseFilterFormProps {
  courseFilterParams: CourseFilterParams;
  navigate: NavigateFunction;
}

interface CourseFilterFormState {
  subjects: string[];
  instructors: number[];
  query: string;
}

class CourseFilterFormClass extends Component<CourseFilterFormProps, CourseFilterFormState> {
  state: CourseFilterFormState = {
    subjects: [],
    instructors: [],
    query: "",
  };

  componentDidUpdate = (prevProps: CourseFilterFormProps): void => {
    if (
      !_.isEqual(prevProps.courseFilterParams, this.props.courseFilterParams)
    ) {
      const { query, subjects, instructors } = this.props.courseFilterParams;
      const normalizedSubjects = Array.isArray(subjects) ? subjects : (subjects ? [subjects] : []);
      const normalizedInstructors = Array.isArray(instructors) 
        ? instructors.map(i => typeof i === 'number' ? i : parseInt(String(i), 10))
        : (instructors ? [typeof instructors === 'number' ? instructors : parseInt(String(instructors), 10)] : []);
      
      this.setState({
        subjects: normalizedSubjects,
        instructors: normalizedInstructors,
        query: query || "",
      });
    }
  };

  onSubjectChange = (subjects: string[]): void => {
    this.setState({
      subjects,
    });
  };

  onInstructorChange = (instructors: number[]): void => {
    this.setState({
      instructors,
    });
  };

  onQueryChange = (_event: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData): void => {
    this.setState({
      query: value,
    });
  };

  onClear = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    this.setState({
      subjects: [],
      instructors: [],
      query: "",
    });
  };

  onSubmit = (): void => {
    const allParams = {
      ...this.props.courseFilterParams,
      ...this.state,
      page: 1,
    };

    if (this.props.courseFilterParams.compareWith) {
      allParams.compareWith = this.props.courseFilterParams.compareWith;
    }

    const params = _.omitBy(allParams, _.isNil);
    this.props.navigate("/search?" + stringify(params));
  };

  render = () => {
    const { instructors, subjects, query } = this.state;

    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Field>
          <label>Search</label>
          <Input
            placeholder="i.e. Math 222, Music in Performance"
            value={query || ""}
            onChange={this.onQueryChange}
          />
        </Form.Field>
        <Divider horizontal content="Filter" className="divider-small" />
        <Form.Field>
          <label>Subjects</label>
          <EntitySelect
            value={subjects || []}
            onChange={(value: (string | number)[]) => this.onSubjectChange(value as string[])}
            entityType="subject"
          />
        </Form.Field>
        <Form.Field>
          <label>Instructors</label>
          <EntitySelect
            value={instructors || []}
            onChange={(value: (string | number)[]) => this.onInstructorChange(value as number[])}
            entityType="instructor"
          />
        </Form.Field>
        <Form.Button positive floated="right">
          Search
        </Form.Button>
        <Button onClick={this.onClear} floated="left">
          Clear
        </Button>
      </Form>
    );
  };
}

const CourseFilterForm: React.FC = () => {
  const navigate = useNavigate();
  const courseFilterParams = useAppSelector(state => state.app.courseFilterParams);

  return <CourseFilterFormClass courseFilterParams={courseFilterParams || {}} navigate={navigate} />;
};

export default CourseFilterForm;
