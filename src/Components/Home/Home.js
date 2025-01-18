import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Home = () => {
  const data = useSelector((store) => store?.user?.status)
  const role = useSelector((store) => store?.user?.data?.role)

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-gradient-to-r from-orange-500 to-red-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to={"/"} className="flex items-center space-x-3 rtl:space-x-reverse">
              <span className="text-2xl font-bold text-white">ProLearning</span>
            </Link>
            <div className="flex space-x-4">
              {data ? (
                <Link to={`/${role}/dashboard`}>
                  <button className="px-4 py-2 rounded-md bg-white text-orange-600 font-semibold hover:bg-orange-100 transition-all duration-300 ease-in-out transform hover:scale-105">
                    Dashboard
                  </button>
                </Link>
              ) : (
                <>
                  <Link to={'/login'}>
                    <button className="px-4 py-2 rounded-md bg-white text-orange-600 font-semibold hover:bg-orange-100 transition-all duration-300 ease-in-out transform hover:scale-105">
                      Login
                    </button>
                  </Link>
                  <Link to={'/signup'}>
                    <button className="px-4 py-2 rounded-md bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-all duration-300 ease-in-out transform hover:scale-105">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <img
                className="w-full rounded-lg shadow-2xl"
                src="https://img.freepik.com/free-vector/learning-concept-illustration_114360-3896.jpg?ga=GA1.1.737633284.1719914973&semt=sph"
                alt="Learning concept illustration"
              />
            </div>
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                ProLearning is Changing the World
              </h1>
              <p className="text-xl text-gray-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore dolor alias aut, adipisci ad voluptates placeat cupiditate. Quidem, vitae voluptatem laborum officiis molestias minus perferendis nulla sed sit animi est! Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
              <div className="mt-8">
                <Link to="/courses">
                  <button className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                    Explore Courses
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h5 className="text-2xl font-bold mb-4">ProLearning (JPL)</h5>
              <p className="text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac ante mollis quam tristique convallis.
              </p>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-4">Quick Links</h5>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors duration-300">Home</Link></li>
                <li><Link to="/courses" className="text-gray-400 hover:text-white transition-colors duration-300">Courses</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-4">Contact Us</h5>
              <ul className="space-y-2 text-gray-400">
                <li>FTTX-Room, B-Ground Floor,</li>
                <li>Ghansoli, Maharashtra-411405</li>
                <li>Phone: (123) 456-7890</li>
                <li>Email: info@prolearning.com</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            &copy; {new Date().getFullYear()} ProLearning. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home

