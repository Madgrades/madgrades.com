import React from 'react';
import SubjectName from '../components/SubjectName';

const SubjectNameList = ({subjectCodes, subjects}) => {
  const result = [];
  const count = (subjectCodes || subjects).length;
  let keys = [];

  if (subjectCodes)
    keys = subjectCodes;
  else
    keys = subjects.map(s => s.code);

  for (let i = 0; i < count; i++) {
    const curr = (subjectCodes || subjects)[i];

    let divider = i < count - 1 && '/';
    result.push(
        <span key={keys[i]}>
          <SubjectName
              code={subjectCodes && curr}
              abbreviate={true}
              fallback='???'
              data={subjects && curr}/>
          {divider}
        </span>
    );
  }

  return result;
};

export default SubjectNameList;