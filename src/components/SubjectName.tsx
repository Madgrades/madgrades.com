import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchSubject } from "../store/slices/subjectsSlice";
import { Subject } from "../types/api";

interface SubjectNameProps {
  code?: string;
  abbreviate?: boolean;
  fallback?: string;
  data?: Subject;
}

const SubjectName: React.FC<SubjectNameProps> = ({ code, data, abbreviate, fallback }) => {
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
  const name = finalData?.name;
  const abbreviation = finalData?.abbreviation;

  const text = abbreviate ? abbreviation : name;
  return <span>{text || fallback}</span>;
};

export default SubjectName;
