import { Classroom } from "./IClassroom"; 
import { NumTimeClassHeld } from "./INumTimeClassHeld";
import { Lecturer } from "./ILecturer";
import { Course } from "./course";
import { WeekType } from "./IWeekType";
import { Semester } from "./ISemester";

export interface Timetable {
    id: number;
    classroom: Classroom;
    lecturer: Lecturer;
    course: Course;
    dayOfWeek: number;
    numberTimeClassHeld: NumTimeClassHeld;
    weekType: WeekType;
    semester: Semester;
}