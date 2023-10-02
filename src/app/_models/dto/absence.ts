import { Student } from "../student";
import { AbsenceType } from "./absenceType";

export interface Absence {
    student: Student;
    absenceDate: Date;
    absenceType: AbsenceType;
}