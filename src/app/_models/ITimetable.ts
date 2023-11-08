import { Classroom } from "./IClassroom"; 
import { NumTimeClassHeld } from "./INumTimeClassHeld";
import { Lecturer } from "./ILecturer";
import { Course } from "./ICourse";
import { WeekType } from "./IWeekType";
import { Semester } from "./ISemester";
import { TimetableGroup } from "./ITimetableGroup";

export interface Timetable {
    id: number;
    classroom: Classroom;
    lecturer: Lecturer;
    course: Course;
    dayOfWeek: number;
    numberTimeClassHeld: NumTimeClassHeld;
    weekType: WeekType;
    semester: Semester;
    timetableGroup: TimetableGroup[];
}