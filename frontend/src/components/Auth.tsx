import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  SignupInput,
  SigninInput,
} from "@ranasarthak/course_selling_app-common/dist";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();

  const [postInputs, setPostInputs] = useState<SignupInput | SigninInput>({
    name: "",
    username: "",
    password: "",
  });

  async function sendRequest(role: "student" | "creator") {
    try {
      await axios.post(
        `${BACKEND_URL}/${role}/${type === "signup" ? "signup" : "signin"}`,
        postInputs,
      );

      navigate(`/${role == "student" ? "" : "courses"}`);
    } catch (e) {
      console.log(e);
      alert("Bhasad ho gayi...!!!");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex h-screen flex-col justify-center">
      <div className="flex justify-center">
        <div>
          <div className="px-10">
            <div className="text-3xl font-extrabold">
              {type === "signin"
                ? "Signin to an account"
                : "Create your account"}
            </div>
            <div className="text-slate-500">
              {type === "signin"
                ? "Don't have an account ?"
                : "Already have an account ?"}
              <Link
                className="pl-2 underline"
                to={type === "signin" ? "/signup" : "/signin"}
              >
                {type === "signin" ? "Register" : "Login"}{" "}
              </Link>
            </div>
          </div>
          <div className="pt-8">
            {type === "signup" ? (
              <LabelledInput
                label="Name"
                placeholder="Sarthak Rana..."
                onChange={(e) => {
                  setPostInputs({
                    ...postInputs,
                    name: e.target.value,
                  });
                }}
              />
            ) : null}
            <LabelledInput
              label="Username"
              placeholder="sara@gmail.com"
              onChange={(e) => {
                setPostInputs({
                  ...postInputs,
                  username: e.target.value,
                });
              }}
            />
            <LabelledInput
              label="Password"
              type={"password"}
              placeholder="12234"
              onChange={(e) => {
                setPostInputs({
                  ...postInputs,
                  password: e.target.value,
                });
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  sendRequest("student");
                }}
                type="button"
                className="mb-2 mt-8 w-full rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                {type === "signin"
                  ? "Sign in as student"
                  : "Sign up as student"}
              </button>
              <button
                onClick={() => {
                  sendRequest("creator");
                }}
                type="button"
                className="mb-2 mt-8 w-full rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                {type === "signin"
                  ? "Sign in as creator"
                  : "Sign up as creator"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({
  label,
  placeholder,
  onChange,
  type,
}: LabelledInputType) {
  return (
    <div>
      <label className="mb-2 block pt-4 text-sm font-semibold text-black">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type || "text"}
        id="first_name"
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
