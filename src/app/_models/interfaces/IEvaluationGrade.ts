import { EvaluationType } from "./IEvaluationType";
import { EvaluationGradeSystem } from "./IEvaluationGradeSystem";

export interface EvaluationGrade {
    id: number;
    evaluationGradeSystem: EvaluationGradeSystem;
    evaluationType: EvaluationType;
    pointNumber: number;
}