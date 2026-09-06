import regexCourseMeta from './courses/regex/course.json';
import regexM1 from './courses/regex/module-1.json';
import regexM2 from './courses/regex/module-2.json';
import regexM3 from './courses/regex/module-3.json';
import regexM4 from './courses/regex/module-4.json';

export const regexCourse = {
  ...regexCourseMeta,
  modules: [regexM1, regexM2, regexM3, regexM4]
};

export const courses = {
  regex: regexCourse
};

export const getCourse = (courseId) => courses[courseId] || null;

export const getModule = (courseId, moduleId) => {
  const course = getCourse(courseId);
  if (!course) return null;
  return course.modules.find((m) => m.id === moduleId) || null;
};
