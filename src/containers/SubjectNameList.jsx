import React from "react";
import { Label } from "semantic-ui-react";
import SubjectName from "../components/SubjectName";

const SubjectNameList = ({ subjectCodes, subjects, courseNumber }) => {
  const result = [];
  const count = (subjectCodes || subjects).length;
  let keys = [];

  if (subjectCodes) keys = subjectCodes;
  else keys = subjects.map((s) => s.code);

  for (let i = 0; i < count; i++) {
    const curr = (subjectCodes || subjects)[i];

    result.push(
      <Label key={keys[i]} size="small" className="subject-pill">
        <SubjectName
          code={subjectCodes && curr}
          abbreviate={true}
          fallback="???"
          data={subjects && curr}
        />
        {courseNumber && ` ${courseNumber}`}
      </Label>,
    );
  }

  return <span className="subject-list">{result}</span>;
};

export default SubjectNameList;
