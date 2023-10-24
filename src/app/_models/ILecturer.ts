import { AcademicDegree } from "./IAcademicDegree"; 

export interface Lecturer {
    id: number;
    userId: number;
    academicDegree: AcademicDegree;
}