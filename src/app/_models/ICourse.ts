import { CourseType } from "./ICourseType";

export interface Course {
    id: number;
    name: string;
    courseType: CourseType;
}