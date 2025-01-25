import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddCourse from "../components/Creator/AddCourse";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { BACKEND_URL } from "../config";
import ModuleCard from "../components/ModuleCard";
import AddModule from "../components/Creator/AddModule";
import {
  CourseData,
  ModuleCardProps,
  PurchaseResponse,
  RazorpayOptions,
  RazorpayResponse,
} from "../type";

function loadRazorPay(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    document.body.appendChild(script);
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
  });
}

export default function CourseDetails() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [showEditCourse, setShowEditCourse] = useState(false);
  const [showAddModule, setShowAddModule] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [courseData, setCourseData] = useState<CourseData>({
    title: "",
    description: "",
    imageUrl: "",
    price: 0,
    discount: 0,
  });
  const [modulesData, setModulesData] = useState<ModuleCardProps[]>([]);

  async function handlePayment(courseId: string) {
    try {
      const { data } = await axios.post<PurchaseResponse>(
        `${BACKEND_URL}/courses/purchase`,
        {
          courseId,
        },
      );
      //this will load RP SDK to our webpage
      const response = await loadRazorPay(
        "https://checkout.razorpay.com/v1/checkout.js",
      );
      if (!response) {
        alert("Razorpay SDK failed to load. Check you internet connection");
        return;
      }

      const options: RazorpayOptions = {
        key: "rzp_test_hZlsBrrU5YCptn",
        amount: data.amount,
        image: data.image,
        currency: "INR",
        order_id: data.orderId,
        name: data.name,
        description: "Course Purchase",
        handler: function (response: RazorpayResponse) {
          console.log(response);
          alert(
            "Payment successful! Payment Id: " + response.razorpay_payment_id,
          );
        },
        prefill: {
          name: "Sarthak Rana",
          email: "sara@gmail.com",
          contact: "999999999",
        },
        theme: {
          color: "#1158B7",
        },
      };

      const paymentObject = new window.Razorpay(options); //creating a RP payment instance
      paymentObject.open(); //opens the pop up window of the instance made above
    } catch (error) {
      console.error(error);
      alert("Payment failed!");
    }
  }

  async function deleteCourse() {
    try {
      await axios.delete(`${BACKEND_URL}/creator/${courseId}`);
      navigate("/courses");
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchCourse() {
    const response = await axios.get(`${BACKEND_URL}/creator/${courseId}`);
    setCourseData(response.data.course);
    setModulesData(response.data.course.modules);
  }

  useEffect(() => {
    fetchCourse();
  }, []);

  if (!courseId) {
    alert("No courseId found.");
    return;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <section
        className={`${showEditCourse || showAddModule ? "blur-sm" : ""}`}
      >
        <div className="left-0 top-0 rounded-t-3xl bg-blue-700 pb-16 pt-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white">
              {courseData.title}
            </h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4">
          <div className="relative grid grid-cols-3 gap-8">
            {/* Main Content Area - No negative margin */}
            <div className="col-span-2">
              {/* Tabs */}
              <div className="mt-8 p-4">
                <div className="flex gap-4 border-b">
                  <button
                    className={`pb-4 text-lg font-medium ${
                      activeTab === "overview"
                        ? "border-b-2 border-blue-700 text-blue-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("overview")}
                  >
                    Overview
                  </button>
                  <button
                    className={`pb-4 text-lg font-medium ${
                      activeTab === "overview"
                        ? "text-gray-500 hover:text-gray-700"
                        : "border-b-2 border-blue-700 text-blue-700"
                    }`}
                    onClick={() => setActiveTab("content")}
                  >
                    Course Content
                  </button>
                </div>
              </div>

              {activeTab === "overview" ? (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-b-lg bg-white p-6"
                >
                  <div className="prose max-w-none">
                    <h2 className="text-2xl font-bold">About this course</h2>
                    <p className="mt-4 text-gray-600">
                      {courseData.description}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-8">
                  {modulesData.map((m) => (
                    <ModuleCard
                      // onModuleDeletion={() => {
                      //   setActiveTab("content");
                      //   fetchCourse();
                      // }}
                      key={m.id}
                      id={m.id}
                      title={m.title}
                      order={m.order}
                      moduleDeleted={() => {
                        fetchCourse();
                        setActiveTab("content");
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col text-center text-white">
              <button
                onClick={() => setShowAddModule(true)}
                className="mt-8 cursor-pointer rounded-full bg-blue-700 px-4 py-4 hover:bg-blue-800"
              >
                + Add Module
              </button>
              <button
                onClick={() => setShowEditCourse(true)}
                className="mt-8 cursor-pointer rounded-full bg-blue-700 px-4 py-4 hover:bg-blue-800"
              >
                Edit Course
              </button>
              <button
                onClick={deleteCourse}
                className="mt-8 flex cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-700 px-4 py-4 hover:bg-blue-800"
              >
                <FaTrash /> Delete
              </button>
              <button
                onClick={() => handlePayment(courseId)}
                className="mt-8 flex cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-700 px-4 py-4 hover:bg-blue-800"
              >
                ₹ Purchase
              </button>
            </div>
          </div>
        </div>
      </section>
      <AnimatePresence>
        {showEditCourse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <AddCourse
                onClose={() => setShowEditCourse(false)}
                onCourseAdded={() => {
                  fetchCourse();
                  setShowEditCourse(false);
                }}
                initialData={{
                  title: courseData.title,
                  description: courseData.description,
                  imageUrl: courseData.imageUrl,
                  price: courseData.price,
                  discount: courseData.discount,
                }}
                type={courseId}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddModule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <AddModule
                onClose={() => setShowAddModule(false)}
                onModuleAdded={() => {
                  setShowAddModule(false);
                  fetchCourse();
                  setActiveTab("content");
                }}
                courseId={courseId}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
