import { motion, AnimatePresence } from "framer-motion";
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaFacebookMessenger,
  FaTelegram,
} from "react-icons/fa";

const ShareOption = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-2xl shadow absolute  w-65 -right-45 bottom-9">
        <ul className="flex grow p-5 flex-col gap-2">
          <button className="shadow bg-white hover:bg-gray-50 border-gray-800 rounded flex items-center p-2 gap-5 ">
            <FaWhatsapp size={32} className="text-[#25D366] w-5 h-5" /> Watsapp
          </button>

          <button className="shadow bg-white hover:bg-gray-50 border-gray-800 rounded flex items-center p-2 gap-5 5  ">
            <FaFacebook size={32} className="text-[#1877F2] w-5 h-5" /> Facebook
          </button>

          <button className="shadow bg-white hover:bg-gray-50 border-gray-800 rounded flex items-center p-2 gap-5  ">
            <FaInstagram size={32} className="text-[#E1306C] w-5 h-5" />{" "}
            Instagram
          </button>

          <button className="shadow bg-white hover:bg-gray-50 border-gray-800 rounded flex items-center p-2 gap-5   ">
            <FaTwitter size={32} className="text-[#1DA1F2] w-5 h-5" /> Twitter
          </button>

          <button className="shadow bg-white hover:bg-gray-50 border-gray-800 rounded flex items-center p-2 gap-5   ">
            <FaFacebookMessenger size={32} className="text-[#0247c7] w-5 h-5" />{" "}
            Messenger
          </button>

          <button className="shadow bg-white hover:bg-gray-50 border-gray-800 rounded flex items-center p-2 gap-5   ">
            <FaTelegram size={32} className="text-[#0088cc] w-5 h-5" /> Telegram
          </button>
        </ul>
      </div>
    </motion.div>
  );
};

export default ShareOption;
