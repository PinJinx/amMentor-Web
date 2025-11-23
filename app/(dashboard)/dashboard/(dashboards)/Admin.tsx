'use client';
import {
  IoPeopleSharp
} from "react-icons/io5";
import {
  FaChartLine,
  FaFolderOpen,
  FaUsers,
  FaGithub,
  FaGitlab,
  FaHome,
  FaCalendarAlt
} from "react-icons/fa";
import TrackDistribution from "../(tasks)/Charts";

const AdminDashboard = () => {
  const topPerformers = [
    { name: "John Doe", track: "Web", score: 4500, progress: 96 },
    { name: "Sarah Smith", track: "Systems", score: 4300, progress: 95 },
    { name: "Mike Johnson", track: "Mobile", score: 4100, progress: 94 },
    { name: "Emma Wilson", track: "AI", score: 3900, progress: 92 },
    { name: "Alex Brown", track: "Web", score: 3700, progress: 90 },
    { name: "Emma Wilson", track: "AI", score: 3900, progress: 92 },
    { name: "Alex Brown", track: "Web", score: 3700, progress: 90 },
    { name: "Emma Wilson", track: "AI", score: 3900, progress: 92 },
    { name: "Alex Brown", track: "Web", score: 3700, progress: 90 },
    { name: "Emma Wilson", track: "AI", score: 3900, progress: 92 },
    { name: "Alex Brown", track: "Web", score: 3700, progress: 90 },
    { name: "Emma Wilson", track: "AI", score: 3900, progress: 92 },
    { name: "Alex Brown", track: "Web", score: 3700, progress: 90 },
    { name: "Emma Wilson", track: "AI", score: 3900, progress: 92 },
    { name: "Alex Brown", track: "Web", score: 3700, progress: 90 },
  ];

  const quickLinks = [
    { name: "Home", icon: <FaHome />, link: "#" },
    { name: "Github", icon: <FaGithub />, link: "#" },
    { name: "GitLab", icon: <FaGitlab />, link: "#" },
    { name: "Events", icon: <FaCalendarAlt />, link: "#" },
  ];

  return (
    <div className="w-[100%] h-[100%] text-white p-6 sm:px-6 lg:px-20  sm:p-8 overflow-hidden bg-darker-grey">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
        <div className=" flex text-3xl gap-2 font-semibold">
          <h1>Welcome,</h1>
          <h1 className="text-[#FFD43B]">Admin</h1>
        </div>
        <h1 className="text-xl">Here’s an overview of the club’s overall progress</h1>    
        </div>

        <button className="mt-3 sm:mt-0 px-4 py-2 bg-dark-grey border border-gray-600 rounded-lg text-sm hover:bg-[#2a2a2a] transition">
          Filter by Dates
        </button>
      </div>

      {/* Grid Layout */}
      <div
        className="
          lg:h-[48rem]
          grid gap-5
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-8
          lg:grid-rows-[repeat(5,minmax(0,1fr))]
        "
      >
        {/* Card 1 */}
        <div className="lg:col-span-2 lg:row-span-1 border border-[#FFD43B] bg-dark-grey rounded-2xl p-5 flex items-center justify-evenly">
          <div className="bg-darker-primary-yellow p-4 rounded-xl">
            <IoPeopleSharp className="text-[#FFD43B] text-4xl" />
          </div>
          <div>
            <h1 className="text-[#FFD43B] text-4xl font-semibold">60</h1>
            <p className="text-gray-400 text-sm">Total Members</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="lg:col-span-2 lg:row-span-1 border border-[#FFD43B] bg-dark-grey rounded-2xl p-5 flex items-center justify-evenly">
          <div className="bg-darker-primary-yellow p-4 rounded-xl">
            <FaChartLine className="text-[#FFD43B] text-4xl" />
          </div>
          <div>
            <h1 className="text-[#FFD43B] text-4xl font-semibold">89%</h1>
            <p className="text-gray-400 text-sm">Avg Progress</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="hover:scale-105 transition-transform lg:col-span-2 lg:row-span-1 border border-[#FFD43B] bg-dark-grey rounded-2xl p-5 flex items-center justify-evenly">
          <div className="bg-darker-primary-yellow p-4 rounded-xl">
            <FaFolderOpen className="text-[#FFD43B] text-4xl" />
          </div>
          <div>
            <h1 className="text-[#FFD43B] text-4xl font-semibold">30</h1>
            <p className="text-gray-400 text-sm">Projects Completed</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="lg:col-span-2 lg:row-span-1 border border-[#FFD43B] bg-dark-grey rounded-2xl p-5 flex items-center justify-evenly">
          <div className="bg-darker-primary-yellow p-4 rounded-xl">
            <FaUsers className="text-[#FFD43B] text-4xl" />
          </div>
          <div>
            <h1 className="text-[#FFD43B] text-4xl font-semibold">57</h1>
            <p className="text-gray-400 text-sm">Active Users</p>
          </div>
        </div>

        {/* Card 5 */}
        <div className="lg:col-span-4 max-h-[600px] lg:row-span-4 bg-dark-grey rounded-2xl p-6">
          <h2 className="text-lg mb-4 font-semibold">Top Performers</h2>
          <div className="space-y-3 h-[90%] overflow-y-scroll">
            {topPerformers.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-[#141414] rounded-xl px-4 py-3"
              >
                <div className="flex flex-col">
                  <span className="text-white font-medium">
                    #{i + 1} {p.name}
                  </span>
                  <span className="text-xs text-gray-400">{p.track}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#FFD43B] font-semibold">{p.score}</span>
                  <div className="w-20 h-2 bg-gray-700 rounded-full mt-1">
                    <div
                      className="h-2 bg-[#FFD43B] rounded-full"
                      style={{ width: `${p.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 6 */}
        <TrackDistribution/>

        {/* Card 7 */}
        <div className="lg:col-span-3 lg:row-span-2 bg-deeper-grey rounded-2xl flex flex-col justify-center items-center text-gray-300 shadow-md">
          <h2 className="text-white font-semibold text-4xl mb-4">Monthly Docs</h2>
          <div className="flex justify-between w-full max-w-[250px] mb-4">
            <div className="flex flex-col items-center">
              <p className="text-xl">Month</p>
              <div className="flex items-center gap-2 text-[#FFD43B] font-semibold">
                <span className="text-3xl cursor-pointer hover:text-yellow-300">&lt;</span>
                <span className="text-white text-2xl">Sept</span>
                <span className="text-3xl cursor-pointer hover:text-yellow-300">&gt;</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xl">Year</p>
              <div className="flex items-center gap-2 text-[#FFD43B] font-semibold">
                <span className="text-lg cursor-pointer hover:text-yellow-300">&lt;</span>
                <span className="text-white text-2xl">2025</span>
                <span className="text-lg cursor-pointer hover:text-yellow-300">&gt;</span>
              </div>
            </div>
          </div>

          <button className="mt-2 w-[200px] py-2 bg-[#FFD43B] text-black font-semibold rounded-full hover:bg-yellow-400 transition">
            Open Document
          </button>
        </div>

        {/* Card 8 */}
        <div className="lg:col-span-1 lg:row-span-2 bg-dark-grey rounded-2xl p-6 flex flex-col justify-center items-center gap-3 text-gray-400">
          <h2 className="text-lg font-semibold">Quick Links</h2>
          {quickLinks.map((link, i) => (
            <a
              key={i}
              href={link.link}
              className="w-full flex items-center gap-2 bg-[#FFD43B] text-black font-semibold px-3 py-2 rounded-lg hover:bg-yellow-400 transition"
            >
              {link.icon} <span>{link.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
