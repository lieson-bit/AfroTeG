import HeadTag from "../../components/HeadTag";
import LoginSignupHeader from "../../components/LoginSignupHeader";
import LoginSignupFooter from "../../components/LoginSignupFooter";
import { FcConferenceCall, FcReadingEbook, FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useState } from "react";

const SignUp = () => {
    // ==================== State Management ===========================
    const [client, setClient] = useState(false);
    const [freelancer, setFreelancer] = useState(false);
    const [btnText, setBtnText] = useState("Create Account");
    const [clientForm, setClientForm] = useState(false);
    const [freelancerForm, setFreelancerForm] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        country: 'Russia',
    });
    const [notification, setNotification] = useState('');
    const [loading, setLoading] = useState(false);

    // ==================== Event Handlers ===========================
    const ClientHandle = () => {
        setClient(true);
        setFreelancer(false);
        setBtnText("Join as a Client");
    };

    const FreelancerHandle = () => {
        setFreelancer(true);
        setClient(false);
        setBtnText("Apply as a Freelancer");
    };

    const HandleConditionForm = () => {
        if (client) {
            setClientForm(true);
            setFreelancerForm(false);
        }
        if (freelancer) {
            setFreelancerForm(true);
            setClientForm(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const HandleForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const role = clientForm ? 'client' : 'freelancer';
            const response = await fetch('http://localhost:4000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, role })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Signup failed');

            setNotification('Signup successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'http://localhost:3000/account-security/login';
            }, 2000);
        } catch (error) {
            setNotification(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <HeadTag title="Create an Account - AfroTeG"/>
            <LoginSignupHeader/>

            <main>
                {/* Initial Selection Section */}
                {(clientForm || freelancerForm) ? null : (
                    <section className="container mx-auto xl:my-14 lg:my-10 md:my-7 my-5 py-3 md:px-5 sm:px-7 px-3 md:flex md:justify-center">
                        <div className="sm:border border-gray-300 rounded-xl">
                            <div className="lg:px-24 md:px-20 sm:px-10 sm:pt-10 pb-10 flex flex-col justify-center md:items-center">
                                <h2 className="font-semibold text-zinc-800 md:text-3xl text-2xl text-center">
                                    Join as a client or freelancer
                                </h2>

                                <div className="flex md:flex-row flex-col items-center md:space-x-8 md:space-y-0 space-y-5 mt-10">
                                    <div className={`${client ? "bg-[#0C4A6E]" : "bg-[#e5ecea] hover:bg-[#d1dfdb]"} rounded-xl py-7 sm:px-8 px-5 flex flex-col items-center space-y-4 md:max-w-[17rem] md:w-auto w-full cursor-pointer transition`} 
                                        onClick={ClientHandle}>
                                        <FcConferenceCall className="text-5xl"/>
                                        <h4 className={`${client ? "text-[#e5ecea]" : "text-zinc-800"} font-semibold text-lg text-center`}>
                                            I'm a client, hiring for a project
                                        </h4>
                                    </div>

                                    <div className={`${freelancer ? "bg-[#0C4A6E]" : "bg-[#e5ecea] hover:bg-[#d1dfdb]"} rounded-xl py-7 sm:px-8 px-5 flex flex-col items-center space-y-4 md:max-w-[17rem] md:w-auto w-full cursor-pointer transition`} 
                                        onClick={FreelancerHandle}>
                                        <FcReadingEbook className="text-5xl"/>
                                        <h4 className={`${freelancer ? "text-[#e5ecea]" : "text-zinc-800"} font-semibold text-lg text-center`}>
                                            I'm a freelancer, looking for work
                                        </h4>
                                    </div>
                                </div>

                                <button className={`${(freelancer || client) ? "bg-[#0C4A6E] hover:bg-[#18465f] text-[#e5ecea]" : "bg-[#e5ecea] hover:bg-[#d1dfdb] text-gray-500"} py-2 md:px-20 px-3 mt-10 rounded-full font-semibold transition md:w-auto w-full`} 
                                    onClick={HandleConditionForm}>
                                    {btnText}
                                </button>

                                <div className="mt-7">
                                    <p className="text-zinc-800 text-center">
                                        Already have an account? 
                                        <Link href="/account-security/login">
                                            <a className="font-semibold text-blue-700 hover:underline"> Log In </a>
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Client/Freelancer Form Section */}
                {(clientForm || freelancerForm) && (
                    <section className="container mx-auto xl:my-14 lg:my-10 md:my-7 my-5 py-3 md:px-5 sm:px-7 px-3 md:flex md:justify-center">
                        <div className="sm:border border-gray-300 rounded-xl">
                            <div className="sm:px-7 sm:pt-10 pb-10 flex flex-col justify-center md:items-center">
                                <h2 className="font-semibold text-zinc-800 md:text-3xl text-2xl text-center">
                                    Sign up to find work you love
                                </h2>

                                <button className="w-full py-2 px-3 bg-white border border-gray-600 rounded-full font-semibold text-zinc-800 transition hover:bg-gray-100 flex items-center justify-center mt-5">
                                    <FcGoogle className="text-xl mr-2"/> 
                                    Continue with Google
                                </button>

                                <div className="flex w-full mt-5 items-center space-x-2">
                                    <span className="border-b w-full border-gray-300 mt-1"></span>
                                    <span className="text-zinc-600">or</span>
                                    <span className="border-b w-full border-gray-300 mt-1"></span>
                                </div>

                                <form className="mt-5 space-y-5 sm:w-auto md:w-[42rem] w-full" onSubmit={HandleForm}>
                                    <div className="grid md:grid-cols-2 md:gap-x-5 gap-y-5">
                                        <div className="flex flex-grow border-2 border-gray-300 transition rounded-lg items-center xl:px-6 px-3 py-1.5 hover:bg-[#F3FFFC] hover:ring-2 ring-[#729bb3] w-full">
                                            <input 
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="flex-grow xl:w-full w-40 focus:outline-none bg-transparent text-zinc-700"
                                                placeholder="First name"
                                            />
                                        </div>

                                        <div className="flex flex-grow border-2 border-gray-300 transition rounded-lg items-center xl:px-6 px-3 py-1.5 hover:bg-[#F3FFFC] hover:ring-2 ring-[#729bb3] w-full">
                                            <input 
                                                type="text" 
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="flex-grow xl:w-full w-40 focus:outline-none bg-transparent text-zinc-700"
                                                placeholder="Last name"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-grow border-2 border-gray-300 transition rounded-lg items-center xl:px-6 px-3 py-1.5 hover:bg-[#F3FFFC] hover:ring-2 ring-[#729bb3] w-full">
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="flex-grow xl:w-full w-40 focus:outline-none bg-transparent text-zinc-700"
                                            placeholder="Email"
                                        />
                                    </div>

                                    <div className="flex flex-grow border-2 border-gray-300 transition rounded-lg items-center xl:px-6 px-3 py-1.5 hover:bg-[#F3FFFC] hover:ring-2 ring-[#729bb3] w-full">
                                        <input 
                                            type="password" 
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="flex-grow xl:w-full w-40 focus:outline-none bg-transparent text-zinc-700"
                                            placeholder="Password"
                                        />
                                    </div>

                                    <select 
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="bg-transparent border-2 border-gray-300 text-zinc-800 text-sm rounded-lg focus:border-[#b8d8d4fd] block w-full px-3 py-2 cursor-pointer font-semibold"
                                    >
                                        <option value="Russia">Russia</option>
                                        <option value="Zambia">Zambia</option>
                                        <option value="Australia">Australia</option>
                                        <option value="Austria">Austria</option>
                                        <option value="Azerbaijan">America</option>
                                        <option value="Bahamas">Bahamas</option>
                                        <option value="Bangladesh">Bangladesh</option>
                                        <option value="Barbados">Barbados</option>
                                    </select>

                                    <div className="flex space-x-3 my-4">
                                        <input id="sendmeemail" type="checkbox" className="w-4 h-4 text-blue-600 bg-transparent rounded border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer mt-[2px]"/>
                                        <label htmlFor="sendmeemail" className="text-zinc-800 cursor-pointer text-sm">
                                            Send me emails with tips on how to find talent that fits my needs.
                                        </label>
                                    </div>

                                    <div className="flex space-x-3 my-4">
                                        <input id="yes" type="checkbox" className="w-4 h-4 text-blue-600 bg-transparent rounded border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer mt-[2px]"/>
                                        <label htmlFor="yes" className="text-zinc-800 cursor-pointer text-sm">
                                            Yes, I understand and agree to the Brenda Terms of Service , including the User Agreement and Privacy Policy
                                        </label>
                                    </div>

                                    {notification && (
                                        <div className="mt-4 p-3 text-center text-sm rounded-lg bg-blue-100 text-blue-800">
                                            {notification}
                                        </div>
                                    )}

                                    <button 
                                        className="w-full py-2 px-3 bg-[#0C4A6E] rounded-full font-semibold text-white transition hover:bg-[#18465f] disabled:opacity-50" 
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating Account...' : 'Create an Account'}
                                    </button>
                                </form>

                                <div className="mt-7">
                                    <p className="text-zinc-800 text-center">
                                        Already have an account? 
                                        <Link href="/account-security/login">
                                            <a className="font-semibold text-blue-700 hover:underline"> Log In </a>
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <LoginSignupFooter/>
        </div>
    );
};

export default SignUp;