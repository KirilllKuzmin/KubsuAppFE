import { DegreeOfStudy } from "./IDegreeOfStudy";
import { Faculty } from "./IFaculty";

export interface Specialty {
    id: number;
    name: string;
    faculty: Faculty;
    degreeOfStudy: DegreeOfStudy;
}