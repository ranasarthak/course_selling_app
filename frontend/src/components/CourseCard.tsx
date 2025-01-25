import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CourseCardProps } from "../type";

export default function CourseCard({
  id,
  title,
  description,
  imageUrl,
  price,
  discount,
}: CourseCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/courses/${id}`)}
      className="cursor-pointer space-y-4 rounded-3xl border pb-4 hover:shadow-lg"
    >
      <img src={imageUrl} alt={title} className="rounded-t-3xl" />
      <h3 className="pb-4 text-base">{title}</h3>
      <h6 className="text-xs">
        {description.length < 25
          ? description
          : description.slice(0, 100) + "..."}
      </h6>
      <div className="flex justify-between px-3 text-sm">
        <div className="flex gap-1">
          <span>₹{(((100 - discount) / 100) * price) / 100}</span>
          <span className="font-light text-slate-400 line-through">
            {price / 100}
          </span>
        </div>

        <div className="text-green-500">{discount}% off</div>
      </div>
      <button className="mx-2 w-[90%] rounded-full bg-blue-700 px-7 py-3 text-center text-sm font-medium text-white hover:bg-blue-800">
        View Content
      </button>
    </motion.div>
  );
}
