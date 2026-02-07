import React from 'react';
import SubjectName from '../components/SubjectName';
import { Subject } from '../types/api';

interface SubjectNameListProps {
  subjectCodes?: string[];
  subjects?: Subject[];
}

const SubjectNameList: React.FC<SubjectNameListProps> = ({ subjectCodes, subjects }) => {
  const result: React.ReactNode[] = [];
  const count = (subjectCodes || subjects)!.length;
  let keys: string[] = [];

  if (subjectCodes) {
    keys = subjectCodes;
  } else {
    keys = subjects!.map(s => s.code);
  }

  for (let i = 0; i < count; i++) {
    const curr = (subjectCodes || subjects)![i];

    const divider = i < count - 1 && '/';
    result.push(
      <span key={keys[i]}>
        <SubjectName
          code={subjectCodes ? curr as string : undefined}
          abbreviate={true}
          fallback='???'
          data={subjects ? curr as Subject : undefined}
        />
        {divider}
      </span>
    );
  }

  return <>{result}</>;
};

export default SubjectNameList;
