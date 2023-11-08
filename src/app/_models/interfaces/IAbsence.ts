import { Student } from "./IStudent";
import { AbsenceType } from "./IAbsenceType";

export interface Absence {
    student: Student;
    absenceDate: Date;
    absenceType: AbsenceType;
}