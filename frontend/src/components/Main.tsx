import React from "react";
import Carousel from "./Carousel";
import Footer from "./Footer";

const Main = () => {
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
      <div className="flex w-[95%] items-center justify-center rounded-lg lg:w-[75%]">
        <Carousel slides={slides} />
      </div>
      <Footer />
    </div>
  );
};

export default Main;
