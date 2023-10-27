import { Student } from "../student";
import { EvaluationType } from "./IEvaluationType";

export interface Evaluation {
    student: Student;
    evaluationDate: Date;
    evaluationType: EvaluationType;
}