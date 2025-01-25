import axios from "axios";
import React, { useState } from "react";
import { BACKEND_URL } from "../../config";
import { AddModuleProps } from "../../type";

function AddModule({ onClose, onModuleAdded, courseId }: AddModuleProps) {
  const [moduleTitle, setModuleTitle] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/module`, {
        title: moduleTitle,
        courseId: courseId,
      });
      onModuleAdded();
      onClose();
    } catch (error) {
      alert("Module creation failed.");
      console.error(error);
    }
  }
  return (
    <div className="">
      <div className="mb-4 flex justify-between text-xl font-bold">
        <h2>Add Module</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          x
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={moduleTitle}
          onChange={(e) => setModuleTitle(e.target.value)}
          type="text"
          placeholder="Module Title"
          className="w-full rounded-md border-black p-2 shadow-md focus:ring-black"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full bg-gray-100 p-2 px-4 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-full bg-blue-700 p-2 px-4 text-white hover:bg-blue-800"
          >
            Add Module
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddModule;
