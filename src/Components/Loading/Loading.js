import React, { useState, useEffect } from "react";

const Loading = () => {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const text = "ProLearning";

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLetters((prev) => (prev < text.length ? prev + 1 : 0));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col bg-transparent items-center justify-center w-full h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-r-4 border-b-4 border-gray-700"></div>
      <div className="mt-8 text-3xl font-bold text-gray-700">
        {text.split('').map((letter, index) => (
          <span
            key={index}
            className={`inline-block transition-opacity duration-300 ${
              index < visibleLetters ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Loading;

