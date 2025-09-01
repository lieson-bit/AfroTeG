import { FaStar } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const ExpartBox = ({ data }) => {
  const [ratings, setRatings] = useState({});

  const handleRating = (projectId, userRating) => {
    setRatings({ ...ratings, [projectId]: userRating });
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10">
      {data.map((curVal) => (
        <motion.div
          key={curVal._id}
          className="bg-white shadow-lg rounded-lg overflow-hidden p-6 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          {/* Centered Large Image */}
          <div className="w-full flex justify-center">
            <Image
              src={`http://localhost:4000/${curVal.images[0]}`}
              width={250}
              height={250}
              alt={curVal.name}
              className="rounded-lg shadow-md"
            />
          </div>

          {/* Project Name */}
          <h3 className="text-2xl font-bold text-gray-800 mt-4">{curVal.name}</h3>

          {/* Description */}
          <p className="text-gray-600 mt-2 px-4">{curVal.description}</p>

          {/* Star Rating System */}
          <div className="flex justify-center items-center mt-4 space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer ${
                  (ratings[curVal._id] || curVal.rating) >= star
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
                onClick={() => handleRating(curVal._id, star)}
              />
            ))}
          </div>

          {/* Visit Project Button */}
          <Link href={curVal.projectUrl} target="_blank">
            <button className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              View Project
            </button>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default ExpartBox;
