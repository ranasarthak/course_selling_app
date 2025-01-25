import About from "../components/Mainlayout/About";
import Carousel from "../components/Mainlayout/Carousel";
import Why from "../components/Mainlayout/Why";

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
    <div>
      <Carousel slides={slides} />
      <Why />
      <About />
    </div>
  );
}
