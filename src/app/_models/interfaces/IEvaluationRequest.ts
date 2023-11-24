export interface EvaluationRequest {
    studentId: number,
    courseId: number,
    typeOfWorkId: number,
    evaluationDate: Date,
    evaluationGradeSystemId: number,
    pointNumber: number
}