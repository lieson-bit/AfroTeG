import { useRouter } from "next/router";

const LoginSignupHeader = () => {
    const router = useRouter();

    return (
        <header className="border-b">
            <nav className="container mx-auto py-3 px-3 flex lg:justify-start justify-center">
                <div className="flex items-center">
                    <a
                        href="#"
                        className="logo-container flex items-center cursor-pointer group"
                        onClick={() => router.push('/')}
                    >
                        <span
                            className="logo-text text-transparent text-3xl font-bold group-hover:text-blue-500"
                            style={{
                                WebkitTextStroke: ".7px #000",
                                transition: "color 0.5s ease",
                            }}
                        >
                            AfroTeG
                        </span>
                    </a>
                </div>
            </nav>
        </header>
    );
}

export default LoginSignupHeader;