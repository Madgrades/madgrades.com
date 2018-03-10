import React from "react";
import SubjectName from "../components/SubjectName";

const SubjectNameList = ({subjectCodes}) => subjectCodes.map((code, i, arr) => {
  let divider = i < arr.length - 1 && '/';
  return (
      <span key={code}>
        <SubjectName
            code={code}
            abbreviate={true}
            fallback="???"/>
        {divider}
      </span>
  )
});

export default SubjectNameList;