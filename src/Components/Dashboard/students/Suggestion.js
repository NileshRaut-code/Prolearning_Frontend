import React, { useState, useCallback } from "react";
import CommentEditor from "./suggestion component/CommentEditor";
import CommentList from "./suggestion component/CommentList";
import { useSelector } from "react-redux";

const Suggestion = ({ topicId }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [showComments, setShowComments] = useState(false); // Track visibility of comments
  const status = useSelector((store) => store.user.status);

  const refreshComments = useCallback(() => {
    setRefreshTrigger((prev) => !prev);
  }, []);

  const toggleComments = () => {
    setShowComments((prev) => !prev); // Toggle visibility of comments
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
      {/* Title (Optional) */}

      {/* Comment Editor */}
      {status && (
        <CommentEditor topicId={topicId} refreshComments={refreshComments} />
      )}

      {/* Toggle Button */}
      <div className="flex justify-end pt-2 pl-4">
        <button
          onClick={toggleComments}
          className={`${
            showComments ? "bg-gray-600" : "bg-gray-800"
          } mt-4 px-6 py-3 text-white rounded-xl shadow-md transition-transform transform hover:scale-105`}
        >
          {showComments ? "Hide Suggestion" : "Read More Suggestion"}
        </button>
      </div>

      {/* Comment List (Visible when showComments is true) */}
      {showComments && (
        <div className="mt-4">
          <CommentList
            topicId={topicId}
            refreshTrigger={refreshTrigger}
            refreshComments={refreshComments}
          />
        </div>
      )}
    </div>
  );
};

export default Suggestion;
