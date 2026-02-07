import React, { useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import { Button, Divider, Form, Input, InputOnChangeData } from "semantic-ui-react";
import EntitySelect from "./EntitySelect";
import { useNavigate } from "react-router-dom";
import { stringify } from "qs";
import * as _ from "lodash";
import { CourseFilterParams } from "../types/api";

const CourseFilterForm: React.FC = () => {
  const navigate = useNavigate();
  const courseFilterParams = useAppSelector(state => state.app.courseFilterParams);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [instructors, setInstructors] = useState<number[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (courseFilterParams) {
      const normalizedSubjects = Array.isArray(courseFilterParams.subjects) 
        ? courseFilterParams.subjects 
        : (courseFilterParams.subjects ? [courseFilterParams.subjects] : []);
      const normalizedInstructors = Array.isArray(courseFilterParams.instructors) 
        ? courseFilterParams.instructors.map(i => typeof i === 'number' ? i : parseInt(String(i), 10))
        : (courseFilterParams.instructors ? [typeof courseFilterParams.instructors === 'number' ? courseFilterParams.instructors : parseInt(String(courseFilterParams.instructors), 10)] : []);
      
      setSubjects(normalizedSubjects);
      setInstructors(normalizedInstructors);
      setQuery(courseFilterParams.query || "");
    }
  }, [courseFilterParams]);

  const onSubjectChange = (newSubjects: string[]): void => {
    setSubjects(newSubjects);
  };

  const onInstructorChange = (newInstructors: number[]): void => {
    setInstructors(newInstructors);
  };

  const onQueryChange = (_event: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData): void => {
    setQuery(value);
  };

  const onClear = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    setSubjects([]);
    setInstructors([]);
    setQuery("");
  };

  const onSubmit = (): void => {
    const allParams: CourseFilterParams = {
      ...(courseFilterParams || {}),
      subjects,
      instructors,
      query,
      page: 1,
    };

    if (courseFilterParams?.compareWith) {
      allParams.compareWith = courseFilterParams.compareWith;
    }

    const params = _.omitBy(allParams, _.isNil);
    navigate("/search?" + stringify(params));
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <label>Search</label>
        <Input
          placeholder="i.e. Math 222, Music in Performance"
          value={query || ""}
          onChange={onQueryChange}
        />
      </Form.Field>
      <Divider horizontal content="Filter" className="divider-small" />
      <Form.Field>
        <label>Subjects</label>
        <EntitySelect
          value={subjects || []}
          onChange={(value: (string | number)[]) => onSubjectChange(value as string[])}
          entityType="subject"
        />
      </Form.Field>
      <Form.Field>
        <label>Instructors</label>
        <EntitySelect
          value={instructors || []}
          onChange={(value: (string | number)[]) => onInstructorChange(value as number[])}
          entityType="instructor"
        />
      </Form.Field>
      <Form.Button positive floated="right">
        Search
      </Form.Button>
      <Button onClick={onClear} floated="left">
        Clear
      </Button>
    </Form>
  );
};

export default CourseFilterForm;
