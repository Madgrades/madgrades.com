import React, { useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import { Dropdown, DropdownProps } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
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

const CourseSortForm: React.FC = () => {
  const navigate = useNavigate();
  const courseFilterParams = useAppSelector(state => state.app.courseFilterParams);
  const [value, setValue] = useState("number");

  useEffect(() => {
    if (courseFilterParams) {
      const { sort, order } = courseFilterParams;
      let newValue: string;

      if (!sort) {
        newValue = "relevance";
      } else if (sort === "relevance") {
        newValue = "relevance";
      } else if (sort === "number") {
        newValue = "number";
        if (order === "desc") newValue = "number_desc";
      } else {
        newValue = "relevance";
      }

      if (newValue !== value) {
        setValue(newValue);
      }
    }
  }, [courseFilterParams, value]);

  const onChange = (_event: React.SyntheticEvent<HTMLElement>, { value: newValue }: DropdownProps): void => {
    setValue(newValue as string);

    let sort: string | undefined, order: string | undefined;

    if (newValue === "number") {
      sort = "number";
    } else if (newValue === "number_desc") {
      sort = "number";
      order = "desc";
    } else if (newValue === "relevance") {
      // nothing to do
    }

    const params = {
      ...(courseFilterParams || {}),
      sort,
      order,
    };
    navigate("/search?" + stringify(params, { encode: false }));
  };

  return (
    <Dropdown
      inline
      direction="left"
      header="Sort options"
      options={sortOptions}
      value={value}
      onChange={onChange}
    />
  );
};

export default CourseSortForm;
