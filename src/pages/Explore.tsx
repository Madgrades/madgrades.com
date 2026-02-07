import React, { useEffect, useState } from "react";
import { Container, Dropdown, Header, Form, DropdownProps } from "semantic-ui-react";
import { Row, Col } from "../components/Grid";
import Explorer, { EntityType } from "../components/Explorer";
import EntitySelect from "../components/EntitySelect";
import { parse, stringify } from "qs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import _ from "lodash";

interface EntityOption {
  key: string;
  text: string;
  value: string;
}

const entityOptions: EntityOption[] = [
  {
    key: "course",
    text: "Courses",
    value: "course",
  },
  {
    key: "instructor",
    text: "Instructors",
    value: "instructor",
  },
  {
    key: "subject",
    text: "Subjects",
    value: "subject",
  },
];

interface ExploreParams {
  page: number;
  sort?: string;
  order?: string;
  subjects?: string[];
  instructors?: number[];
  minCountAvg?: number;
  minGpaTotal?: number;
}

const Explore: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { entity } = useParams<{ entity?: string }>();

  const getInitialParams = (entityType: string, searchParams?: Record<string, string | string[]>): ExploreParams => {
    const params = searchParams || parse(location.search.substr(1));
    const minAvg = entityType === "subject" ? 1 : 25;
    const minTotal = entityType === "course" ? 1500 : 500;

    const filteredParams: ExploreParams = {
      page: parseInt((params.page as string) || "1", 10),
      sort: params.sort as string,
      order: params.order as string,
      subjects: params.subjects as string[],
      instructors: params.instructors 
        ? (params.instructors === "" ? undefined : (params.instructors as string[]).map((s: string) => parseInt(s, 10)))
        : undefined,
    };

    if (!params.instructors) {
      filteredParams.minCountAvg = minAvg;
      filteredParams.minGpaTotal = minTotal;
    }

    return filteredParams;
  };

  const [entityType, setEntityType] = useState<string>(entity || "course");
  const [params, setParams] = useState<ExploreParams>(getInitialParams(entity || "course"));

  useEffect(() => {
    document.title = "Explore UW Madison Courses - Madgrades";
  }, []);

  useEffect(() => {
    const newEntityType = entity || "course";
    const newParams = getInitialParams(newEntityType);

    if (!_.isEqual(params, newParams) || entityType !== newEntityType) {
      setEntityType(newEntityType);
      setParams(newParams);
    }
  }, [location, entity]);

  const onEntityChange = (_event: React.SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
    navigate("/explore/" + data.value);
  };

  const updateParams = (newParams: ExploreParams): void => {
    setParams(newParams);
    navigate(location.pathname + "?" + stringify(newParams));
  };

  const onPageChange = (page: number): void => {
    updateParams({
      ...params,
      page,
    });
  };

  const onSortOrderChange = (sort: string, order: string): void => {
    updateParams({
      ...params,
      sort,
      order,
      page: 1,
    });
  };

  const onSubjectChange = (value: (string | number)[]): void => {
    updateParams({
      ...params,
      subjects: value.map(v => String(v)),
    });
  };

  const onInstructorChange = (value: (string | number)[]): void => {
    updateParams({
      ...params,
      instructors: value.map(v => typeof v === 'number' ? v : parseInt(String(v), 10)),
    });
  };

  const {
    page,
    sort,
    order,
    minCountAvg,
    minGpaTotal,
    subjects,
    instructors,
  } = params;

  const filterParams: Record<string, string> = {};

  if (entityType !== "subject" && subjects) {
    filterParams.subjects = subjects.join(",");
  }

  if (entityType !== "subject" && instructors) {
    filterParams.instructors = instructors.join(",");
  }

  return (
    <div className="Explore">
      <Container>
        <Header as="h1">
          <Header.Content>
            Explore:{" "}
            <Dropdown
              inline
              options={entityOptions}
              onChange={onEntityChange}
              value={entityType}
            />
          </Header.Content>
          <Header.Subheader>
            Find GPA stats on courses, instructors, subjects.*
          </Header.Subheader>
        </Header>

        <Row>
          {entityType !== "subject" && (
            <Col xs={12} md={6}>
              <p />
              <Form>
                <Form.Field>
                  <label>Filter subjects</label>
                  <EntitySelect
                    entityType="subject"
                    value={subjects}
                    onChange={onSubjectChange}
                  />
                </Form.Field>
              </Form>
            </Col>
          )}

          {entityType !== "subject" && (
            <Col xs={12} md={6}>
              <p />
              <Form>
                <Form.Field>
                  <label>Filter instructors</label>
                  <EntitySelect
                    entityType="instructor"
                    value={instructors}
                    onChange={onInstructorChange}
                  />
                </Form.Field>
              </Form>
            </Col>
          )}
        </Row>

        <Explorer
          entityType={entityType as EntityType}
          page={page}
          sort={sort}
          order={order}
          minCountAvg={minCountAvg}
          minGpaTotal={minGpaTotal}
          onPageChange={onPageChange}
          onSortOrderChange={onSortOrderChange}
          filterParams={filterParams}
        />
        <p>* Some entries are omitted due to small class sizes.</p>
      </Container>
    </div>
  );
};

export default Explore;
