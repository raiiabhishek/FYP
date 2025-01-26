import React from "react";
import Nav from "../Nav";
import Footer from "../Footer";

function LandingPage() {
  return (
    <div className="font-sans">
      {/* Header */}
      <Nav />

      {/* Hero Section */}
      <section className="bg-indigo-100 py-16 px-5 lg:px-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8">
            <h2 className="text-3xl font-bold mb-4 text-indigo-900">
              Revolutionize School Management with Blockchain
            </h2>
            <p className="text-gray-700 mb-8">
              Experience the future of education administration with our
              all-in-one system. Manage events, exams, assignments, and more –
              all secured by smart contracts.
            </p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded">
              Get Started
            </button>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://placehold.co/400x300/ededed/indigo?text=School+Image"
              alt="School Management System"
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-16 px-5 lg:px-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-indigo-900 text-center">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2 text-indigo-800">
                Events Management
              </h3>
              <p className="text-gray-700">
                Create, schedule, and manage all school events seamlessly. Keep
                parents and students informed.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2 text-indigo-800">
                Exam & Assignment Portal
              </h3>
              <p className="text-gray-700">
                Conduct exams, assignments, and grading efficiently. Track
                student progress with ease.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2 text-indigo-800">
                Smart Contract Security
              </h3>
              <p className="text-gray-700">
                Secure data with tamper-proof blockchain technology. Built using
                Solidity smart contracts for enhanced security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-16 bg-indigo-100 px-5 lg:px-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-indigo-900 text-center">
            Why Choose Our System?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2 text-indigo-800">
                Enhanced Security
              </h3>
              <p className="text-gray-700">
                Leveraging smart contracts ensures your school data is secure,
                transparent, and tamper-proof.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2 text-indigo-800">
                Efficiency and Automation
              </h3>
              <p className="text-gray-700">
                Automate routine tasks, reduce administrative burden, and free
                up time for what matters most: teaching and learning.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2 text-indigo-800">
                Streamlined Communication
              </h3>
              <p className="text-gray-700">
                Improve communication between teachers, students, and parents
                with instant updates and notifications.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2 text-indigo-800">
                Future-Proof Technology
              </h3>
              <p className="text-gray-700">
                Stay ahead with the latest blockchain innovation, offering
                scalability and adaptability for future educational needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
