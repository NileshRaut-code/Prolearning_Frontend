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
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      {/* Title */} 

      {/* Comment Editor */}
      {status && (
        <CommentEditor topicId={topicId} refreshComments={refreshComments} />
      )}

      {/* Toggle Button */}
      <div className="flex justify-end pt-2 pl-4">
        <button
          onClick={toggleComments}
          className={`${
            showComments ? "bg-red-500" : "bg-blue-500"
          } mt-4 px-4 py-2 bg-[#FF725E] text-white rounded-xl transition hover:delay-50 hover:scale-105"`}
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
