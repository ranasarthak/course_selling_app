import { IoHomeSharp } from "react-icons/io5";
import { FaGraduationCap } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const navigate = useNavigate();

  async function logout() {
    try {
      await axios.post(
        `${BACKEND_URL}/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      navigate("/signin");
    } catch (error) {
      console.error(error);
      alert("Failed to logout. Please logout again.");
    }
  }

  return (
    <div
      className={`fixed z-40 h-auto min-h-screen w-72 -translate-x-full transform bg-[#E7F1FD] p-10 transition-transform duration-300 lg:relative lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div>
        <ul className="space-y-5">
          <li className="text-xs font-semibold text-gray-500">MAIN MENU</li>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 ${isActive ? "text-blue-500" : "text-gray-500"} hover:text-blue-500`
              }
            >
              <IoHomeSharp />
              <h1>Home</h1>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `flex items-center gap-3 ${isActive ? "text-blue-500" : "text-gray-500"} hover:text-blue-500`
              }
            >
              <FaGraduationCap />
              Courses
            </NavLink>
          </li>{" "}
          <li>
            <NavLink
              onClick={logout}
              to="/signin"
              className="flex items-center gap-3 text-gray-500 hover:text-blue-500"
            >
              <BiSolidPurchaseTagAlt />
              Purchased Courses
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={logout}
              to="/signin"
              className="flex items-center gap-3 text-gray-500 hover:text-blue-500"
            >
              <MdLogout />
              Logout
            </NavLink>
          </li>
          <li>
            <div className="md:hidden">
              <button
                onClick={() => navigate("/signup")}
                className="m-2 rounded-full bg-blue-700 px-7 py-3 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Signup
              </button>
              <button
                onClick={() => navigate("/signin")}
                className="m-2 my-2 rounded-full bg-blue-700 px-7 py-3 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Login
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
