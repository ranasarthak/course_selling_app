import { Auth } from "../components/Auth";
import { motion } from "framer-motion";

export const Signup = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Auth type="signup" />
    </motion.div>
  );
};
