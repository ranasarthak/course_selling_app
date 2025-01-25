import React, { useState } from "react";
import { AddLessonProps } from "../../type";
import axios from "axios";
import { BACKEND_URL } from "../../config";

function AddLesson({ onClose, onLessonAdded, moduleId }: AddLessonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile || !title) return;

    try {
      setIsUploading(true);
      const fileExtension = selectedFile.name.split(".").pop();
      const { data: urlData } = await axios.post(
        `${BACKEND_URL}/lessons/get-upload-url`,
        {
          moduleId,
          title,
          fileExtension,
        },
      );

      await axios.put(urlData.uploadUrl, selectedFile);

      await axios.post(`${BACKEND_URL}/lessons`, {
        moduleId,
        title,
        key: urlData.key,
        lessonId: urlData.lessonId,
      });

      onLessonAdded();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Unable to get upload URL. Try again.!!");
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File files should be less than 10 MB");
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-between text-xl font-bold">
        <h2>Add Lesson</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          x
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full rounded-md border p-2 shadow-md"
          type="text"
          placeholder="Lesson Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="w-full rounded-md border p-2"
          required
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 p-2 px-4 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="rounded-full bg-blue-700 p-2 px-4 text-white hover:bg-blue-800"
          >
            {isUploading ? "Uploading..." : "Add Lesson"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddLesson;
