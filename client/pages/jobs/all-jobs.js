import HeadTag from "../../components/HeadTag";
import Navbar from "../../components/Navbar/Navbar";
import CompetitionCard from '../../components/CompetitionCard';
import { IoIosArrowDown } from "react-icons/io";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsFilterSquare } from "react-icons/bs";
import { HiX } from "react-icons/hi";
import Footer from "../../components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";

const AllJobs = () => {

    // ================== Hooks Call ==========================
    const [activeTab, setActiveTab] = useState("job"); // 'job' or 'competition'
    const [category, useCategory] = useState(true);
    const [jobType, useJobType] = useState(true);
    const [clientHistory, useClientHistory] = useState(true);
    const [projectLength, useProjectLength] = useState(true);
    const [hoursPerWeek, useHourPerWeek] = useState(true);
    const [competitionStatus, useCompetitionStatus] = useState(true);
    const [showFilter, setShowFilter] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [competitions, setCompetitions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("relevance");
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [filters, setFilters] = useState({
        jobType: [],
        projectLength: [],
        hoursPerWeek: [],
        competitionStatus: []
    });

     // ================== Filter Functions ==========================
     const filteredJobs = jobs.filter(job => {
        // Search filter
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            job.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Price filter
        const matchesPrice = (!priceRange.min || job.budget >= priceRange.min) && 
                           (!priceRange.max || job.budget <= priceRange.max);
        
        // Job type filter
        const matchesJobType = filters.jobType.length === 0 || 
                              filters.jobType.includes(job.pricingType);
        
        return matchesSearch && matchesPrice && matchesJobType;
    });

    const filteredCompetitions = competitions.filter(competition => {
        // Search filter
        const matchesSearch = competition.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            competition.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Prize filter
        const matchesPrize = (!priceRange.min || competition.prizeAmount >= priceRange.min) && 
                           (!priceRange.max || competition.prizeAmount <= priceRange.max);
        
        // Status filter
        const matchesStatus = filters.competitionStatus.length === 0 || 
                             filters.competitionStatus.includes(competition.status);
        
        return matchesSearch && matchesPrize && matchesStatus;
    });

    // ================== Handle click function ==========================
    const CatSearchForm = (e) => {
        e.preventDefault();
    }

    const handleSearch = (e) => {
        e.preventDefault();
    }

    const FilterHandleBtn = () => {
        (showFilter == false) ? setShowFilter(true) : setShowFilter(false);
    }

    const handlePriceFilter = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setPriceRange(prev => ({ ...prev, [name]: value }));
    };

    const toggleFilter = (filterType, value) => {
        setFilters(prev => {
            const currentFilters = [...prev[filterType]];
            const index = currentFilters.indexOf(value);
            
            if (index === -1) {
                currentFilters.push(value);
            } else {
                currentFilters.splice(index, 1);
            }
            
            return { ...prev, [filterType]: currentFilters };
        });
    };

    // Fetch jobs data
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/jobs/");
                const data = await response.json();
                // Try this instead:

                setJobs(Array.isArray(data) ? data : data.jobs || []);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchJobs();
    }, []);
    

    useEffect(() => {
      const fetchCompetitions = async () => {
        try {
          const response = await fetch("http://localhost:4000/api/competitions");
          const data = await response.json();
          setCompetitions(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error fetching competitions:", error);
        }
      };
    
      fetchCompetitions();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
          {/* ============== Head Tag =============== */}
          <HeadTag title="Freelance All Jobs - AfroTeG"/>
      
          {/* ================== Header =================== */}
          <header className="header-bg">
            {/* ============== Navbar ============ */}
            <Navbar/>
          </header>
      
          {/* ================= Main ==================== */}
          <main>
            {/* ==================== first section ================== */}
            <section className="container mx-auto xl:my-14 lg:my-10 md:my-7 my-5 py-3 md:px-5 sm:px-7 px-3">
              {/* Tab Toggle */}
              <div className="flex justify-center mb-8">
                <div className="flex border border-[#0C4A6E] rounded-full overflow-hidden">
                  <button
                    className={`py-2 px-6 font-medium ${activeTab === "job" ? "bg-[#0C4A6E] text-white" : "text-[#0C4A6E] hover:bg-gray-100"}`}
                    onClick={() => setActiveTab("job")}
                  >
                    Jobs
                  </button>
                  <button
                    className={`py-2 px-6 font-medium ${activeTab === "competition" ? "bg-[#0C4A6E] text-white" : "text-[#0C4A6E] hover:bg-gray-100"}`}
                    onClick={() => setActiveTab("competition")}
                  >
                    Competitions
                  </button>
                </div>
              </div>
      
              <div className="flex">
                {/* ======================== Filter Part ======================== */}
                <aside className={`xl:w-[25%] lg:w-[30%] 2xl:pr-10 sm:pr-8 pr-7 lg:pl-0 sm:pl-8 pl-7 lg:py-0 py-5 lg:relative absolute lg:bg-transparent bg-[#F3FFFC] lg:z-0 z-[5] lg:shadow-none shadow-2xl lg:border-none border sm:left-auto left-0 lg:rounded-none sm:rounded-l-xl rounded-r-lg transition ${showFilter ? "translate-x-0" : "lg:translate-x-0 translate-x-[-150%]"}`}>
                  <div className="lg:block flex justify-between items-center">
                    <h4 className="text-zinc-800 font-semibold text-xl">Filter By</h4>
                    <button className="lg:hidden block text-zinc-700 transition hover:text-zinc-500" onClick={() => setShowFilter(false)}>
                      <HiX className="h-6 w-6"/>
                    </button>
                  </div>
      
                  {/* Price/Prize Range Filter */}
                  <div className="py-4 border-b-2 border-zinc-200 mt-3">
                    <div className="flex justify-between items-center cursor-pointer">
                      <span className="text-zinc-800 font-semibold text-[17px]"> 
                        {activeTab === "job" ? "Budget Range" : "Prize Range"} 
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        name="min"
                        placeholder="Min"
                        className="p-2 border border-gray-300 rounded-lg"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                      />
                      <input
                        type="number"
                        name="max"
                        placeholder="Max"
                        className="p-2 border border-gray-300 rounded-lg"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                      />
                    </div>
                  </div>
      
                  {/* Category Filter */}
                  <div className="py-4 border-b-2 border-zinc-200 mt-3">
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => useCategory(!category)}>
                      <span className="text-zinc-800 font-semibold text-[17px]">Category</span>
                      <IoIosArrowDown className={`text-zinc-800 font-semibold text-2xl hover:text-zinc-600 transition ${category ? "rotate-180" : ""}`}/>
                    </div>
                    {category && <div>
                      <form className="flex flex-grow border-2 lg:max-w-sm rounded-full items-center xl:px-4 px-3 py-1 bg-[#f9fffdfd] relative my-6 2xl:mx-5 border-gray-300 focus:outline outline-offset-2 outline-2 outline-blue-600" onSubmit={CatSearchForm}>
                        <FaSearch className="rounded-full duration-300 ease-in text-zinc-800 cursor-pointer hover:text-[#2b4241fd] text-sm"/>
                        <input 
                          type="text" 
                          className="flex-grow w-[100%] focus:outline-none bg-transparent ml-3 text-zinc-700 placeholder:text-[15px]"
                          placeholder="Select Category"
                        />
                      </form>
                    </div>}
                  </div>
      
                  {/* Job-specific Filters */}
                  {activeTab === "job" && (
                    <>
                      <div className="py-4 border-b-2 border-zinc-200 mt-1">
                        <div className="flex justify-between items-center cursor-pointer" onClick={() => useJobType(!jobType)}>
                          <span className="text-zinc-800 font-semibold text-[17px]">Job Type</span>
                          <IoIosArrowDown className={`text-zinc-800 font-semibold text-2xl hover:text-zinc-600 transition ${jobType ? "rotate-180" : ""}`}/>
                        </div>
                        {jobType && <div>
                          <div className="flex space-x-3 my-4 items-center">
                            <input 
                              id="hourly" 
                              type="checkbox" 
                              checked={filters.jobType.includes("Hourly")}
                              onChange={() => toggleFilter('jobType', 'Hourly')}
                              className="w-5 h-5 text-blue-600 bg-transparent rounded border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                            />
                            <label htmlFor="hourly" className="text-zinc-800 cursor-pointer">
                              Hourly
                            </label>
                          </div>
                          <div className="flex space-x-3 my-4 items-center">
                            <input 
                              id="fixed" 
                              type="checkbox" 
                              checked={filters.jobType.includes("Fixed")}
                              onChange={() => toggleFilter('jobType', 'Fixed')}
                              className="w-5 h-5 text-blue-600 bg-transparent rounded border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                            />
                            <label htmlFor="fixed" className="text-zinc-800 cursor-pointer">
                              Fixed
                            </label>
                          </div>
                        </div>}
                      </div>
      
                      <div className="py-4 border-b-2 border-zinc-200 mt-1">
                        <div className="flex justify-between items-center cursor-pointer" onClick={() => useProjectLength(!projectLength)}>
                          <span className="text-zinc-800 font-semibold text-[17px]">Project Length</span>
                          <IoIosArrowDown className={`text-zinc-800 font-semibold text-2xl hover:text-zinc-600 transition ${projectLength ? "rotate-180" : ""}`}/>
                        </div>
                        {projectLength && <div>
                          {['Less than 1 month', '1 to 3 months', '3 to 6 month', 'More then 6 months'].map((option) => (
                            <div key={option} className="flex space-x-3 my-4 items-center">
                              <input 
                                id={option.replace(/\s+/g, '-')} 
                                type="checkbox" 
                                checked={filters.projectLength.includes(option)}
                                onChange={() => toggleFilter('projectLength', option)}
                                className="w-5 h-5 text-blue-600 bg-transparent rounded border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                              />
                              <label htmlFor={option.replace(/\s+/g, '-')} className="text-zinc-800 cursor-pointer">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>}
                      </div>
                    </>
                  )}
      
                  {/* Competition-specific Filters */}
                  {activeTab === "competition" && (
                    <div className="py-4 border-b-2 border-zinc-200 mt-1">
                      <div className="flex justify-between items-center cursor-pointer" onClick={() => useCompetitionStatus(!competitionStatus)}>
                        <span className="text-zinc-800 font-semibold text-[17px]">Status</span>
                        <IoIosArrowDown className={`text-zinc-800 font-semibold text-2xl hover:text-zinc-600 transition ${competitionStatus ? "rotate-180" : ""}`}/>
                      </div>
                      {competitionStatus && <div>
                        {['Upcoming', 'Ongoing', 'Judging', 'Completed'].map((status) => (
                          <div key={status} className="flex space-x-3 my-4 items-center">
                            <input 
                              id={status} 
                              type="checkbox" 
                              checked={filters.competitionStatus.includes(status)}
                              onChange={() => toggleFilter('competitionStatus', status)}
                              className="w-5 h-5 text-blue-600 bg-transparent rounded border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                            />
                            <label htmlFor={status} className="text-zinc-800 cursor-pointer">
                              {status}
                            </label>
                          </div>
                        ))}
                      </div>}
                    </div>
                  )}
                </aside>
      
                {/* =========================== Main Content ============================= */}
                <div className="2xl:w-[75%] lg:w-[70%] w-full sm:border border-gray-300 rounded-xl">
                  <div className="sm:py-7 pb-7 sm:px-7 px-1.5 border-b border-gray-300">
                    <div className="lg:hidden flex justify-end">
                      <button className="text-zinc-600 transition hover:text-zinc-500" onClick={() => setShowFilter(!showFilter)}>
                        <BsFilterSquare className="h-8 w-8"/>
                      </button>
                    </div>
      
                    <div className="lg:mt-0 mt-5">
                      <form className="flex flex-grow border-2 lg:max-w-full items-center bg-[#f9fffdfd] relative transition hover:border-[#b8d8d4fd] rounded-xl border-gray-300" onSubmit={handleSearch}>
                        <input 
                          type="text" 
                          className="flex-grow focus:outline-none bg-transparent mx-3 text-zinc-700"
                          placeholder={`Search for ${activeTab === "job" ? "jobs" : "competitions"}`}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="px-3 py-2 rounded-r-xl duration-300 ease-in bg-zinc-800 cursor-pointer hover:bg-[#2b4241fd]">
                          <FaSearch className="h-5 text-white"/>
                        </button>
                      </form>
      
                      <div className="mt-2">
                        <Link href="#">
                          <a className="font-semibold text-zinc-800 hover:underline hover:text-[#525554fd] cursor-pointer">
                            Advanced search
                          </a>
                        </Link>
                      </div>
                    </div>
      
                    <div className="flex sm:flex-row flex-col justify-between sm:items-center sm:space-y-0 space-y-5 mt-5">
                      <div className="text-zinc-700">
                        <span className="text-zinc-800 font-semibold">
                          {activeTab === "job" ? filteredJobs.length : filteredCompetitions.length}
                        </span> {activeTab === "job" ? "jobs" : "competitions"} found
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <label htmlFor="sort" className="text-zinc-800 font-semibold">Sort:</label>
                        <select 
                          id="sort" 
                          className="bg-transparent border-2 border-gray-300 text-zinc-800 text-sm rounded-lg focus:ring-blue-500 focus:border-[#b8d8d4fd] block w-full px-3 py-2 cursor-pointer font-semibold"
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                        >
                          <option value="relevance">Relevance</option>
                          <option value="newest">Newest</option>
                          <option value="price-high">Price (High to Low)</option>
                          <option value="price-low">Price (Low to High)</option>
                        </select>
                      </div>
                    </div>
                  </div>
      
                  {/* Content Display */}
                  {activeTab === "job" ? (
                    <div>
                      {filteredJobs.map((job) => (
                        <div key={job._id} className="py-7 sm:px-7 px-1.5 border-b border-gray-300 space-y-5">
                          <div className="flex flex-col space-y-3">
                            <Link href={`/jobs/${job._id}`}>
                              <a className="font-semibold text-zinc-800 hover:underline hover:text-blue-900 cursor-pointer">
                                {job.title}
                              </a>
                            </Link>
                            <small className="text-zinc-500 space-x-1 text-sm">
                              <strong>{job.budget ? `$${job.budget}` : "Hourly rate not specified"}</strong>
                              <span>-</span>
                              <span>{job.difficultyLevel || "Not specified"}</span>
                              <span>-</span>
                              <span>Est. Budget:</span>
                              <span>{job.duration || "Not specified"}</span>
                              <span>-</span>
                              <span>Posted</span>
                              <span>{new Date(job.createdAt).toLocaleString() || "Unknown"}</span>
                            </small>
                            <p className="text-[15px] text-zinc-800">{job.description}</p>
                            <div className="flex space-x-2 space-y-1 items-start flex-wrap">
                              {Array.isArray(job.skillsRequired) && job.skillsRequired.length > 0 ? (
                                job.skillsRequired.map((skill, index) => (
                                  <a key={index} className="py-1 px-2.5 rounded-full text-zinc-500 bg-[#ebf0effd] text-sm font-semibold cursor-pointer transition hover:bg-[#e3e7e6fd]">
                                    {skill}
                                  </a>
                                ))
                              ) : (
                                <span>No skills specified</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredCompetitions.map((competition) => (
                        <CompetitionCard key={competition._id} competition={competition} />
                      ))}
                    </div>
                  )}
      
                  {/* Pagination */}
                  <div className="py-7 sm:px-7 px-1.5 space-y-3">
                    <div className="flex md:flex-row flex-col justify-between md:items-center md:space-x-5 md:space-y-0 space-y-7">
                      <div className="flex md:flex-row flex-col md:items-center md:space-x-3 md:space-y-0 space-y-3">
                        <label htmlFor="jobpages" className="text-zinc-800 font-semibold text-[13px]"> 
                          {activeTab === "job" ? "Jobs" : "Competitions"} Per Page:  
                        </label>
                        <select id="jobpages" className="bg-transparent border-2 border-gray-300 text-zinc-800 text-sm rounded-lg focus:ring-blue-500 focus:border-[#b8d8d4fd] block w-full px-3 py-2 cursor-pointer font-semibold">
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="30">30</option>
                        </select>
                      </div>
      
                      <div className="flex justify-between items-center space-x-3">
                        <div className="text-zinc-800 font-semibold flex items-center space-x-1 cursor-pointer hover:underline">
                          <FaChevronLeft/>
                          <a className="hover:underline">Previous</a>
                        </div>
      
                        <ul className="sm:flex items-center space-x-1 hidden">
                          <li>
                            <a className="py-1 px-2 rounded-lg bg-zinc-800 text-white cursor-pointer shadow-lg">
                              1 
                            </a>
                          </li>
                          <li>
                            <a className="py-1 px-2 rounded-lg hover:bg-zinc-200 text-zinc-800 cursor-pointer"> 
                              2 
                            </a>
                          </li>
                          <li>
                            <a className="py-1 px-2 rounded-lg hover:bg-zinc-200 text-zinc-800 cursor-pointer"> 
                              3 
                            </a>
                          </li>
                          <li>
                            <a className="py-1 px-2 rounded-lg hover:bg-zinc-200 text-zinc-800 cursor-pointer"> 
                              10+ 
                            </a>
                          </li>
                        </ul>
      
                        <div className="text-zinc-800 font-semibold flex items-center space-x-1 cursor-pointer hover:underline">
                          <a>Next</a>
                          <FaChevronRight/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
      
          {/* ==================== Footer ====================== */}
          <Footer/>
        </div>
      )
    }
export default AllJobs;