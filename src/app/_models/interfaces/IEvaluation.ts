import { Student } from "./IStudent";
import { EvaluationType } from "./IEvaluationType";

export interface Evaluation {
    student: Student;
    evaluationDate: Date;
    evaluationType: EvaluationType;
}