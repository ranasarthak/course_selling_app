import { IoHomeSharp } from "react-icons/io5";
import { FaGraduationCap } from "react-icons/fa6";

export default function Sidebar() {
  return (
    <div className="hidden h-auto w-72 bg-[#E7F1FD] p-10 lg:block">
      <div>
        <ul className="space-y-5">
          <li>MAIN MENU</li>
          <li>
            <div className="flex items-center gap-3">
              <IoHomeSharp />
              <h1
                className={`${window.location.pathname === "/home" ? "text-blue-500" : "text-black"}`}
              >
                Home
              </h1>
            </div>
          </li>
          <li>
            <div className="flex items-center gap-3">
              <FaGraduationCap />
              Courses
            </div>
          </li>
          <li>
            <div className="sm:hidden">
              <button className="m-2 rounded-full bg-blue-700 px-7 py-3 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300">
                Signup
              </button>
              <button className="m-2 my-2 rounded-full bg-blue-700 px-7 py-3 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300">
                Login
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
