import { Student } from "./IStudent";
import { EvaluationGrade } from "./IEvaluationGrade";
import { WorkDates } from "./IWorkDates";

export interface Evaluation {
    student: Student;
    evaluationDate: Date;
    evaluationGrade: EvaluationGrade;
    workDate: WorkDates;
}