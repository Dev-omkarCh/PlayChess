import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-8 px-4 border-t-2 border-sectionBorder">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-lg font-semibold">Developer</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <Link to="/" className="hover:text-gray-400">
                Synopsis
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gray-400">
                About Us
              </Link>
            </li>
            
            <li>
              <Link to="/" className="hover:text-gray-400">
                Resume
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Connect with Us</h2>
          <div className="flex space-x-4 mt-4">
          <a href="https://github.com/Dev-omkarCh" target="_blank" aria-label="GitHub">
              <FaGithub className="text-2xl hover:text-gray-400" />
            </a>
            <a href="https://www.linkedin.com/in/omkar-chikhale-076a00275/" aria-label="Instagram" target="_blank">
              <FaLinkedin className="text-2xl hover:text-gray-400" />
            </a>
            <a href="https://www.instagram.com/om.kar816?igsh=MWd5dDF5bGd5ejFpMw==" aria-label="Instagram" target={"_blank"}>
              <FaInstagram className="text-2xl hover:text-gray-400" />
            </a>
            <a href="https://x.com/Omkarch10" target="_blank" aria-label="Twitter">
              <FaTwitter className="text-2xl hover:text-gray-400" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=100087449895467&mibextid=ZbWKwL" target="_blank" aria-label="Facebook">
              <FaFacebook className="text-2xl hover:text-gray-400" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center border-t border-sectionBorder pt-4">
        <p>©All Rights are Reserved 2025–2026</p>
      </div>
    </footer>
  );
};

export default Footer;
