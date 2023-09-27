import { CourseType } from "./courseType";

export interface Course {
    id: number;
    name: string;
    courseType: CourseType;
}