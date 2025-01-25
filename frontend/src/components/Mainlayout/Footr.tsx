import { Link } from "react-router-dom";
import { BsTwitterX } from "react-icons/bs";
import { BsGooglePlay } from "react-icons/bs";
import { BsYoutube } from "react-icons/bs";
import { BsInstagram } from "react-icons/bs";

export default function Footr() {
  return (
    <footer id="footer" className="container py-2">
      <div className="rounded-3xl bg-[#E7F1FD] p-10">
        <div className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-3">
          <div>
            <img
              src="https://appx-wsb-gcp-mcdn.akamai.net.in/subject/2023-01-17-0.3698267942851394.jpg"
              className="m-1 size-16 cursor-pointer rounded-full md:size-24"
            />
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold">Quick Links</h3>
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
          <div>
            <div className="flex flex-col gap-2">
              <div className="text-lg font-bold">Download App</div>
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
              <div className="md: gap-4 space-x-0 lg:flex">
                <div>Powered by</div>
                <img
                  src="https://appx-static.akamai.net.in/teachcode-logo.png"
                  className="w-28"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
