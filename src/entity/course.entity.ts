import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Enrollment } from './enrollment.entity';
import { Lesson } from './lesson.entity';
import { Assignment } from './assignment.entity';
import { CourseLevel } from '../enums/CourseLevel';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: CourseLevel,
    default: CourseLevel.BEGINNER,
  })
  level: CourseLevel;

  @Column({ nullable: true })
  duration: string;

  @Column({ nullable: true })
  image_url: string;

  @ManyToOne(() => User, user => user.instructorCourses, { nullable: false })
  @JoinColumn({ name: 'instructor_id' })
  instructor: User;

  @ManyToOne(() => User, user => user.subInstructorCourses)
  @JoinColumn({ name: 'sub_instructor_id' })
  subInstructor: User;

  @OneToMany(() => Enrollment, enrollment => enrollment.course)
  enrollments: Enrollment[];

  @ManyToMany(() => Lesson, lesson => lesson.courses)
  @JoinTable({
    name: 'lesson_course',
    joinColumn: { name: 'course_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'lesson_id', referencedColumnName: 'id' },
  })
  lessons: Lesson[];

  @OneToOne(() => Assignment, assignment => assignment.course)
  @JoinColumn({ name: 'assignment_id' })
  assignment: Assignment;

  constructor(partial?: Partial<Course>) {
    Object.assign(this, partial);
  }
}
