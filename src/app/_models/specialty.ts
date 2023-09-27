import { DegreeOfStudy } from "./degreeOfStudy";
import { Faculty } from "./faculty";

export interface Specialty {
    id: number;
    name: string;
    faculty: Faculty;
    degreeOfStudy: DegreeOfStudy;
}