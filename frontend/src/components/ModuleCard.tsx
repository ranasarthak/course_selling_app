import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { Lesson, ModuleCardProps } from "../type";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import AddLesson from "./Creator/AddLesson";
import { FaPlay } from "react-icons/fa";

export default function ModuleCard({
  id,
  title,
  order,
  moduleDeleted,
}: ModuleCardProps) {
  const [showContent, setShowContent] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  async function fetchLessons() {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/lessons/${id}`);
      setLessons(data.lessons);
    } catch (error) {
      console.error("Failed to fetch lessons: ", error);
    }
  }

  async function handlePlayVideo(lessonId: string) {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/lessons/${lessonId}/play`,
      );
      setSelectedVideo(data.playUrl);
    } catch (error) {
      console.error("Unable to play video:", error);
    }
  }

  function handleLessonAdded() {
    fetchLessons();
    setAddingLesson(false);
  }

  async function deleteLesson(lessonId: string) {
    try {
      await axios.delete(`${BACKEND_URL}/lessons/${lessonId}`);
      fetchLessons();
    } catch (error) {
      alert("Lesson deletion failed..!!! Try again.");
      console.error(error);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between rounded-b-3xl bg-blue-700 p-4 text-white">
        <div>{`${order}. ${title}`}</div>
        <div className="space-x-4">
          <button
            onClick={async () => {
              await axios.delete(`${BACKEND_URL}/module/${id}`);
              moduleDeleted();
            }}
          >
            <MdDelete />
          </button>
          <button onClick={() => setAddingLesson(!addingLesson)}>
            <IoMdAdd />
          </button>
          <button
            onClick={() => {
              setShowContent(!showContent);
              setSelectedVideo(null);
              fetchLessons();
            }}
          >
            <IoIosArrowDropdownCircle />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {selectedVideo && (
              <div className="mb-4">
                <video
                  controls
                  autoPlay
                  className="w-full rounded-lg shadow-lg"
                  src={selectedVideo}
                ></video>
                <button
                  onClick={() => {
                    setSelectedVideo(null);
                  }}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Close Video
                </button>
              </div>
            )}
            {lessons.length === 0 ? (
              <div className="text-blue-700">
                No lessons available for this module.
              </div>
            ) : (
              <div className="space-y-2">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between rounded-lg bg-gray-200 p-3 text-blue-700 transition-colors hover:bg-gray-300"
                  >
                    <div className="flex items-center space-x-4">
                      <button onClick={() => handlePlayVideo(lesson.id)}>
                        <FaPlay />
                      </button>
                      <span>{`${lesson.order}. ${lesson.title}`}</span>
                    </div>
                    <button onClick={() => deleteLesson(lesson.id)}>
                      <MdDelete />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {addingLesson && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95"
          >
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <AddLesson
                onClose={() => {
                  setAddingLesson(false);
                }}
                onLessonAdded={handleLessonAdded}
                moduleId={id}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
