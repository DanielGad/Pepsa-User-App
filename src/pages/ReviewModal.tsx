import { useState } from "react";
import { FaStar } from "react-icons/fa";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewModal = ({ isOpen, onClose }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [review, setReview] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    console.log({ rating, review });
    setRating(0);
    setReview("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-red-100 bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded-lg w-[90%] max-w-md shadow-md pt-15">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-5 text-5xl text-gray-500 hover:text-red-500 focus:outline-none cursor-pointer"
        >
          &times;
        </button>

        {/* Header */}
        <div className="bg-red-100 py-4 text-center mb-6 rounded-t">
          <h2 className="text-xl font-semibold">Review</h2>
        </div>

        {/* Star Rating */}
        <div className="mb-4">
          <label className="block font-medium mb-2 text-sm text-gray-800">Product Rating</label>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <FaStar
                  key={starValue}
                  size={24}
                  className={`cursor-pointer transition ${
                    starValue <= (hover ?? rating) ? "text-orange-400" : "text-gray-300"
                  }`}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(null)}
                />
              );
            })}
          </div>
        </div>

        {/* Review Textarea */}
        <div className="mb-6">
          <label className="block font-medium text-sm text-gray-800 mb-1">Write a review</label>
          <textarea
            rows={4}
            placeholder="Enter review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Done Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-red-700 hover:bg-red-800 text-white text-lg font-semibold py-2 rounded-lg cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
