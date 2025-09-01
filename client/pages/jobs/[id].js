import { useRouter } from "next/router";
import JobManager from "../../components/JobManager";
import { useEffect, useState } from "react";
import LoginSignupHeader from "../../components/LoginSignupHeader";
import HeadTag from "../../components/HeadTag";
import Navbar from "../../components/Navbar/Navbar";
import BannerContainer from "../../components/BannerContainer";
import { motion } from "framer-motion";
import Footer from "../../components/Footer";

const JobPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [jobId, setJobId] = useState(null);

  useEffect(() => {
    if (id) {
      setJobId(id);
    }
  }, [id]);

  if (!jobId) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeadTag title="Talent Marketplace - Post a Job - Talent Marketplace | AfroTeG" />
      <header className="header-bg">
        {/* ============== Navbar ============ */}
        <Navbar />

        {/* ============ Head Container ============ */}
        <BannerContainer
          heading={"Post a job today, hire tomorrow"}
          des={
            "Connect with talent that gets you, and hire them to take your business to the next level"
          }
          btnI={{ text: "Find Talent", link: "#" }}
          btnII={{ text: "Find work", link: "#" }}
          img={"/images/team1.png"}
        />
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left Side - Job Manager */}
        <div className="lg:w-2/3 w-full">
          <JobManager jobId={jobId} />
        </div>

        {/* Right Side - Enterprise Solutions */}
        <div className="lg:w-1/2 w-full">
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 sticky top-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-zinc-800 text-2xl font-bold mb-6">
              Enterprise solutions to scale your talent strategy
            </h2>

            <div className="space-y-6">
              {/* Talent Services Card */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">
                      Talent Services
                    </h3>
                    <p className="text-gray-600">
                      Comprehensive tools from hiring to project management in one platform.
                    </p>
                  </div>
                </div>
              </div>

              {/* Compliance Card */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">
                      Compliance Protection
                    </h3>
                    <p className="text-gray-600">
                      Legal safeguards and classification services to mitigate risks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Card */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">
                      Secure Platform
                    </h3>
                    <p className="text-gray-600">
                      Safe environment for managing your hybrid team with confidence.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200">
                Speak with Our Talent Experts
              </button>

              {/* Stats Section */}
              <div className="bg-blue-50 p-5 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3 text-center">
                  Talent Marketplace Insights
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">85%</p>
                    <p className="text-sm text-blue-800">Faster hiring</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">4.9/5</p>
                    <p className="text-sm text-blue-800">Client satisfaction</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">10k+</p>
                    <p className="text-sm text-blue-800">Active talents</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">24h</p>
                    <p className="text-sm text-blue-800">Avg. response time</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default JobPage;