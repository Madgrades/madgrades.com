import React, { Component, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchSubject } from "../store/slices/subjectsSlice";
import { Subject } from "../types/api";

interface SubjectNameProps {
  code?: string;
  abbreviate?: boolean;
  fallback?: string;
  data?: Subject;
}

interface SubjectNameClassProps extends SubjectNameProps {
  name?: string;
  abbreviation?: string;
}

class SubjectNameClass extends Component<SubjectNameClassProps> {
  render = (): JSX.Element => {
    const { name, abbreviation, abbreviate, fallback } = this.props;

    const text = abbreviate ? abbreviation : name;
    return <span>{text || fallback}</span>;
  };
}

const SubjectName: React.FC<SubjectNameProps> = ({ code, data, ...props }) => {
  const dispatch = useAppDispatch();
  const subjectData = useAppSelector(state => 
    code && !data ? state.subjects.data[code]?.data : undefined
  );

  useEffect(() => {
    if (code && !data) {
      dispatch(fetchSubject(code));
    }
  }, [code, data, dispatch]);

  const finalData = data || subjectData;

  return (
    <SubjectNameClass
      {...props}
      code={code}
      data={finalData}
      name={finalData?.name}
      abbreviation={finalData?.abbreviation}
    />
  );
};

export default SubjectName;
