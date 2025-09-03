import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-[#F4F4F4] py-4 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-gray-600 text-center">
            Made with ❤️ by Harsh Vyas
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/harshvyas-22/infodraft"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaGithub size={24} />
            </a>

            <a
              href="https://www.linkedin.com/in/harsh-vyas-22abc/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaLinkedin size={24} />
            </a>

            <a
              href="mailto:harshvyas98397916@gmail.com"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <MdEmail size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
