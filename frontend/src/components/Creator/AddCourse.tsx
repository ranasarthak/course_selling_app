import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../../config";
import { AddCourseProps, CourseData } from "../../type";

export default function AddCourse({
  onClose,
  onCourseAdded,
  initialData,
  type,
}: AddCourseProps) {
  const [courseData, setCourseData] = useState<CourseData>(initialData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    setCourseData((prev) => ({
      ...prev, //this keeps all the old values and the next line updates just one of the values
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (type == "add") {
      e.preventDefault();
    }
    try {
      if (type === "add") {
        await axios.post(`${BACKEND_URL}/creator/course`, courseData);
      } else {
        await axios.patch(`${BACKEND_URL}/creator/${type}`, courseData);
      }
      onCourseAdded();
      onClose();
    } catch (error) {
      if (type === "add") {
        alert("Course creation failed.");
      } else {
        alert("Failed to edit the course");
      }
      console.error("Error creating course: ", error);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-xl font-bold">
        <h2>{type === "add" ? "Add New Course" : "Edit course"}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          X
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Course Title
          </label>
          <input
            type="text"
            name="title"
            value={courseData.title}
            onChange={handleChange}
            placeholder="Course Title"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Course Banner
          </label>
          <input
            type="text"
            name="imageUrl"
            value={courseData.imageUrl}
            onChange={handleChange}
            placeholder="Course Banner"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={courseData.description}
            onChange={handleChange}
            placeholder="Course Description"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            name="price"
            value={courseData.price}
            onChange={handleChange}
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Discount %
          </label>
          <input
            name="discount"
            value={courseData.discount}
            onChange={handleChange}
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            {type === "add" ? "Create course" : "Edit course"}
          </button>
        </div>
      </form>
    </div>
  );
}
