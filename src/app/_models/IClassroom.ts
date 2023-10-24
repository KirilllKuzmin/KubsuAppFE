import { AcademicBuilding } from "./IAcademicBuilding";

export interface Classroom {
    id: number;
    classroomNumber: number;
    academicBuilding: AcademicBuilding;
}