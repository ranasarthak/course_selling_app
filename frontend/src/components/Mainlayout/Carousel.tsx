import { useEffect, useState } from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { FaArrowCircleLeft } from "react-icons/fa";

interface Slide {
  url: string;
  title: string;
}

interface SliderProps {
  slides: Slide[];
}

export default function Carousel({ slides }: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex == slides.length - 1) setCurrentIndex(0);
      else setCurrentIndex((currentIndex) => currentIndex + 1);
    }, 3000);

    return () => clearInterval(timer);
  });

  const previousSlide = () => {
    if (currentIndex == 0) setCurrentIndex(slides.length - 1);
    else setCurrentIndex((currentIndex) => currentIndex - 1);
  };

  const nextSlide = () => {
    if (currentIndex == slides.length - 1) setCurrentIndex(0);
    else setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden rounded-3xl py-2">
        <div
          className="flex transition duration-700 ease-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {slides.map((slide) => (
            <img src={slide.url} />
          ))}
        </div>

        <div className="absolute top-0 flex size-10 h-full w-full items-center justify-between px-10 text-3xl text-white">
          <button className="cursor-pointer">
            <FaArrowCircleLeft onClick={previousSlide} />
          </button>
          <button className="cursor-pointer">
            <FaArrowAltCircleRight onClick={nextSlide} />
          </button>
        </div>
      </div>
      <div className="flex w-full cursor-pointer items-center justify-center gap-3 py-3">
        {slides.map((s, i) => {
          return (
            <div
              onClick={() => {
                setCurrentIndex(i);
              }}
              key={"circle" + i}
              className={`h-3 w-3 rounded-full ${i == currentIndex ? "bg-black" : "bg-gray-300"} hover:bg-black`}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
