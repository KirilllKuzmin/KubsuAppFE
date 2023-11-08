import { Specialty } from "./ISpecialty";

export interface Group {
    id: number;
    name: string;
    specialty: Specialty;
}