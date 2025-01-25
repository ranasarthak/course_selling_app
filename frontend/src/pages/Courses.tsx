import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import AddCourse from "../components/Creator/AddCourse";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { CourseCardProps } from "../type";

export default function Courses() {
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courses, setCourses] = useState<CourseCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchCourses() {
    try {
      const response = await axios.get(`${BACKEND_URL}/creator/courses`);
      setCourses(response.data.courses);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <section
        className={`container text-center text-2xl font-semibold ${showAddCourse ? "blur-sm" : ""}`}
      >
        <div className="flex items-center justify-between pb-4">
          <h1 className="text-lg">Courses</h1>
          <button
            onClick={() => setShowAddCourse(true)}
            className="rounded-full bg-blue-700 px-5 py-3 text-sm text-white hover:bg-blue-800"
          >
            + Add Course
          </button>
        </div>

        {isLoading ? (
          <div></div>
        ) : (
          <div className="grid gap-4 py-2 md:grid-cols-2 lg:grid-cols-3">
            {/* <CourseCard courseId="undefined" />
          <CourseCard courseId="undefined" />
          <CourseCard courseId="undefined" /> */}

            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                imageUrl={course.imageUrl}
                price={course.price}
                discount={course.discount}
              />
            ))}
          </div>
        )}
      </section>
      <AnimatePresence>
        {showAddCourse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <AddCourse
                onClose={() => setShowAddCourse(false)}
                onCourseAdded={() => {
                  fetchCourses();
                  setShowAddCourse(false);
                }}
                initialData={{
                  title: "",
                  description: "",
                  imageUrl: "",
                  price: 0,
                  discount: 0,
                }}
                type="add"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
