import { Specialty } from "./specialty";

export interface Group {
    id: number;
    name: string;
    specialty: Specialty;
}