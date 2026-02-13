import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import GpaChart from "../containers/charts/GpaChart";
import GradeDistributionChart from "../containers/charts/GradeDistributionChart";
import utils from "../utils";

// Helper: derive grade-distribution-array for GPA time series based on selection
function getGradeDistributionsForSelection(data, instructorId, termCode) {
  if (!data) return [];

  // term-specific selection (no instructor filter)
  if (termCode && !instructorId) {
    const offerings = Array.isArray(data.courseOfferings)
      ? data.courseOfferings
      : [];
    const offering = offerings.find((o) => o.termCode === termCode);
    if (offering)
      return [{ ...(offering.cumulative || {}), termCode: offering.termCode }];
    return [];
  }

  // instructor-level selection (no term filter)
  if (instructorId > 0 && !termCode) {
    const instructors = Array.isArray(data.instructors) ? data.instructors : [];
    const instructor = instructors.find((i) => i.id === instructorId);
    if (instructor && Array.isArray(instructor.terms))
      return instructor.terms.map((t) => ({ ...t }));
    return [];
  }

  // instructor + term selection
  if (instructorId > 0 && termCode) {
    const instructors = Array.isArray(data.instructors) ? data.instructors : [];
    const instructor = instructors.find((i) => i.id === instructorId);
    if (!instructor || !Array.isArray(instructor.terms)) return [];
    const offering = instructor.terms.find((t) => t.termCode === termCode);
    return offering ? [{ ...offering }] : [];
  }

  // default: use all courseOfferings
  const offerings = Array.isArray(data.courseOfferings)
    ? data.courseOfferings
    : [];
  return offerings.map((o) => ({
    ...(o.cumulative || {}),
    termCode: o.termCode,
  }));
}

// Helper: derive cumulative distribution object (for GradeDistributionChart primary/secondary)
function getCumulativeForSelection(data, instructorId, termCode) {
  if (!data) return null;

  if (termCode && !instructorId) {
    const offerings = Array.isArray(data.courseOfferings)
      ? data.courseOfferings
      : [];
    const offering = offerings.find((o) => o.termCode === termCode);
    return offering ? offering.cumulative || null : null;
  }

  if (instructorId > 0 && !termCode) {
    const instructors = Array.isArray(data.instructors) ? data.instructors : [];
    const instructor = instructors.find((i) => i.id === instructorId);
    return instructor ? instructor.cumulative || null : null;
  }

  if (instructorId > 0 && termCode) {
    const instructors = Array.isArray(data.instructors) ? data.instructors : [];
    const instructor = instructors.find((i) => i.id === instructorId);
    if (!instructor || !Array.isArray(instructor.terms)) return null;
    const offering = instructor.terms.find((t) => t.termCode === termCode);
    return offering ? offering : null;
  }

  return data.cumulative || null;
}

const CombinedCourseCharts = ({
  course1Uuid,
  course2Uuid,
  course1Data,
  course2Data,
  course1InstructorId,
  course1TermCode,
  course2InstructorId,
  course2TermCode,
  course1Name,
  course2Name,
}) => {
  const course1GpaSeries = getGradeDistributionsForSelection(
    course1Data,
    course1InstructorId,
    course1TermCode,
  );
  const course2GpaSeries = getGradeDistributionsForSelection(
    course2Data,
    course2InstructorId,
    course2TermCode,
  );

  const course1Cumulative = getCumulativeForSelection(
    course1Data,
    course1InstructorId,
    course1TermCode,
  );
  const course2Cumulative = getCumulativeForSelection(
    course2Data,
    course2InstructorId,
    course2TermCode,
  );

  const primaryLabel = course1Name
    ? `${course1Name} - ${course1Cumulative ? utils.grades.gpa(course1Cumulative, true) : ""}`
    : "Primary";
  const secondaryLabel = course2Name
    ? `${course2Name} - ${course2Cumulative ? utils.grades.gpa(course2Cumulative, true) : ""}`
    : "Secondary";

  // helper: produce a short human-readable selection description for a course
  const describeSelection = (data, instructorId, termCode) => {
    if (!data) return "(No data)";

    const instructors = Array.isArray(data.instructors) ? data.instructors : [];

    if (termCode && !instructorId) {
      return `(${utils.termCodes.toName(termCode)})`;
    }

    if (instructorId > 0 && !termCode) {
      const instr = instructors.find((i) => i.id === instructorId);
      return instr ? `(${instr.name})` : `(Instructor ${instructorId})`;
    }

    if (instructorId > 0 && termCode) {
      const instr = instructors.find((i) => i.id === instructorId);
      const termName = utils.termCodes.toName(termCode);
      return instr ? `(${instr.name} — ${termName})` : `(${termName})`;
    }

    return `(Cumulative)`;
  };

  const sel1 = describeSelection(
    course1Data,
    course1InstructorId,
    course1TermCode,
  );
  const sel2 = describeSelection(
    course2Data,
    course2InstructorId,
    course2TermCode,
  );

  const bothCumulative = sel1 === "(Cumulative)" && sel2 === "(Cumulative)";

  const gpaTitle = bothCumulative
    ? `Average GPA — ${course1Name || "Course 1"} vs ${course2Name || "Course 2"}`
    : `Average GPA — ${course1Name || "Course 1"} ${sel1} vs ${course2Name || "Course 2"} ${sel2}`;

  const gdTitle = bothCumulative
    ? `Cumulative Grade Distribution — ${course1Name || "Course 1"} vs ${course2Name || "Course 2"}`
    : `Grade Distribution — ${course1Name || "Course 1"} ${sel1} vs ${course2Name || "Course 2"} ${sel2}`;

  // append selection descriptor to legend labels when not both cumulative
  const gdPrimaryLabel = bothCumulative
    ? primaryLabel
    : `${primaryLabel} ${sel1}`;
  const gdSecondaryLabel = bothCumulative
    ? secondaryLabel
    : `${secondaryLabel} ${sel2}`;

  // also augment GPA legend labels when selection is not purely cumulative
  const gpaPrimaryLabel = bothCumulative
    ? primaryLabel
    : `${primaryLabel} ${sel1}`;
  const gpaSecondaryLabel = bothCumulative
    ? secondaryLabel
    : `${secondaryLabel} ${sel2}`;

  return (
    <div style={{ marginBottom: "1.5em" }}>
      <GpaChart
        title={gpaTitle}
        primary={course1GpaSeries}
        secondary={course2GpaSeries}
        primaryLabel={gpaPrimaryLabel}
        secondaryLabel={gpaSecondaryLabel}
      />

      <div style={{ marginTop: "1em" }}>
        <GradeDistributionChart
          title={gdTitle}
          primary={course1Cumulative}
          primaryLabel={gdPrimaryLabel}
          secondary={course2Cumulative}
          secondaryLabel={gdSecondaryLabel}
        />
      </div>
    </div>
  );
};

CombinedCourseCharts.propTypes = {
  course1Uuid: PropTypes.string.isRequired,
  course2Uuid: PropTypes.string.isRequired,
  course1InstructorId: PropTypes.number,
  course1TermCode: PropTypes.number,
  course2InstructorId: PropTypes.number,
  course2TermCode: PropTypes.number,
  course1Data: PropTypes.object,
  course2Data: PropTypes.object,
  course1Name: PropTypes.string,
  course2Name: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
  return {
    course1Data: state.grades.courses.data[ownProps.course1Uuid],
    course2Data: state.grades.courses.data[ownProps.course2Uuid],
    course1Name: state.courses.data[ownProps.course1Uuid]
      ? state.courses.data[ownProps.course1Uuid].name
      : null,
    course2Name: state.courses.data[ownProps.course2Uuid]
      ? state.courses.data[ownProps.course2Uuid].name
      : null,
  };
}

export default connect(mapStateToProps)(CombinedCourseCharts);
