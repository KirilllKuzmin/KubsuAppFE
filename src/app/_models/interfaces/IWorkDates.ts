import { EvaluationGradeSystem } from "./IEvaluationGradeSystem";
import { TypeOfWork } from "./ITypeOfWork";

export interface WorkDates {
    typeOfWork: TypeOfWork;
    workDateTime: Date;
    evaluationGradeSystem: EvaluationGradeSystem;
}