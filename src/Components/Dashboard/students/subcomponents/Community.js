import React from 'react';

const Community = () => {
  // Sample data for community posts
  const posts = [
    {
      id: 1,
      user: "Ava Martin",
      time: "1 min ago",
      message: "I have completed my homework, but I have yet decided how to arrange it so that it looks beautiful!",
      unreadMessages: 3,
    },
    {
      id: 2,
      user: "Ava Martin",
      time: "1 min ago",
      message: "I have completed my homework, but I have yet decided how to arrange it so that it looks beautiful!",
      unreadMessages: 0,
    },
    {
      id: 3,
      user: "Nilu Martin",
      time: "5 min ago",
      message: "I have completed my homework, but I have yet decided how to arrange it so that it looks beautiful!",
      unreadMessages: 3,
    },
    // Add more posts here if needed
  ];

  return (
    <div className="bg-white pt-4 rounded-lg shadow-md flex items-center justify-center">
      <h2 className="mb-4 mr-10 pl-8 text-2xl font-bold text-gray-800">Community</h2>
      <div>
        {posts.map(post => (
          <div key={post.id} className="mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500 text-white text-lg font-semibold">
                {post.user[0]} {/* Initial of user's name */}
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-800">{post.user}</h4>
                <p className="text-sm text-gray-500">{post.time}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-700">{post.message}</p>
            </div>
            {post.unreadMessages > 0 && (
              <div className="mt-2 text-sm text-red-600">
                {post.unreadMessages} unread message(s)
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
