import { Metadata } from "next";
import { CourseLibrary } from "@/components/course/course-library";

export const metadata: Metadata = { title: "课程库" };

export default function CoursesPage() {
  return <CourseLibrary />;
}
