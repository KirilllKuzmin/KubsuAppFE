import { AcademicBuilding } from "./IAcademicBuilding";

export interface Classroom {
    id: number;
    classroomNumber: string;
    academicBuilding: AcademicBuilding;
}