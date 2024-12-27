import { Link } from "react-router-dom";
import { BsTwitterX } from "react-icons/bs";
import { BsGooglePlay } from "react-icons/bs";
import { BsYoutube } from "react-icons/bs";
import { BsInstagram } from "react-icons/bs";

export default function Footer() {
  return (
    <div className="relative mx-auto mb-0 max-w-6xl justify-between space-y-8 rounded-t-3xl bg-[#E7F1FD] p-12 md:flex md:gap-4 md:space-y-2">
      <img
        src="https://appx-wsb-gcp-mcdn.akamai.net.in/subject/2023-01-17-0.3698267942851394.jpg"
        className="m-1 size-24 cursor-pointer rounded-full"
      />
      <div className="flex flex-col gap-4">
        <div className="font-bold">Quick Links</div>
        <div className="flex flex-col gap-2">
          <Link to="/" className="text-blue-500 underline">
            Terms & Conditions
          </Link>
          <Link to="/" className="text-blue-500 underline">
            Privacy Policy
          </Link>
          <Link to="/" className="text-blue-500 underline">
            Refunds & Cancellation Policy
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="font-bold">Download App</div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
          className="w-32"
        />
        <div className="font-bold">Follow us</div>
        <div className="flex gap-3">
          <div>
            <BsTwitterX />
          </div>
          <div>
            <BsGooglePlay />
          </div>
          <div>
            <BsYoutube />
          </div>
          <div>
            <BsInstagram />
          </div>
        </div>
        <div className="md: gap-4 space-x-0 md:flex">
          <div>Powered by</div>
          <img
            src="https://appx-static.akamai.net.in/teachcode-logo.png"
            className="w-28"
          />
        </div>
      </div>
    </div>
  );
}
