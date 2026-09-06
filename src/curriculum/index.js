import { regexCourse } from './courses/regex/course.js';

export const courses = {
  regex: regexCourse
};

export const getCourse = (courseId) => courses[courseId] || null;

export const getModule = (courseId, moduleId) => {
  const course = getCourse(courseId);
  if (!course) return null;
  return course.modules.find((m) => m.id === moduleId) || null;
};
