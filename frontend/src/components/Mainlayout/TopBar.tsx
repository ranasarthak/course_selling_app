import { IoMenu } from "react-icons/io5";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { TopBarProps } from "../../type";

export default function Topbar({ setIsOpen }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50 flex justify-between gap-10 border-b bg-white drop-shadow-md">
      <div className="ml-8 flex items-center justify-center gap-x-2">
        <IoMenu
          className="size-8 cursor-pointer lg:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
        />
        <img
          onClick={() => navigate("/")}
          src="https://appx-wsb-gcp-mcdn.akamai.net.in/subject/2023-01-17-0.3698267942851394.jpg"
          className="m-1 size-12 cursor-pointer rounded-full"
        />
      </div>
      <div className="mr-8 flex items-center justify-center">
        <input
          type="text"
          placeholder="Type here to search.."
          className="w-64 rounded-full rounded-r-none border-r-2 bg-[#F6F7F9] p-2.5"
        />
        <div className="mr-5 flex size-11 cursor-pointer items-center justify-center rounded-full rounded-l-none bg-[#F6F7F9]">
          <BsSearch />
        </div>
        {
          <div className="hidden md:block">
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
        }
      </div>
    </div>
  );
}
