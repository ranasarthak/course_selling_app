import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";
import Topbar from "../components/TopBar";

export default function Home() {
  const slides = [
    {
      url: "https://appxcontent.kaxa.in/subject/2024-07-07-0.9522250790418232.png",
      title: "web 3 and web dev cohort",
    },
    {
      url: "https://appxcontent.kaxa.in/subject/2024-07-05-0.3715048534115637.jpeg",
      title: "complete web dev cohort",
    },
    {
      url: "https://appxcontent.kaxa.in/subject/2024-07-05-0.8025085370209641.jpeg",
      title: "complete blockchain cohort",
    },
  ];
  return (
    <div className="">
      <Topbar />
      <div className="flex h-screen w-full">
        <Sidebar />
        <div className="mx-auto w-[95%] space-y-10 pt-10 sm:w-3/5">
          <Carousel slides={slides} />
          <Footer />
        </div>
      </div>
    </div>
  );
}
