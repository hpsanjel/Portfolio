import Image from "next/image";

export default function Footer() {
    return (
        <footer className="mt-20">
            <a href="/">
                <div className="text-center">
                    <Image src="/images/logo-black.png" alt="logo" width={96} height={40} className="w-24 mx-auto cursor-pointer dark:hidden" />
                    <Image src="/images/logo-white.png" alt="logo" width={96} height={40} className="w-24 mx-auto cursor-pointer hidden dark:block" />
                </div>
            </a>
            <div className="text-center flex items-center border-t border-gray-400 mx-[10%] mt-12 py-6">
                <p className="mx-auto">@ 2024 Hari Prasad Sanjel. All rights reserved.</p>
                <ul className="fixed bottom-10 sm:bottom-28 right-4 sm:right-10 flex flex-col gap-2">
                    <li className="dark:bg-gray-300 hover:bg-gray-100 rounded-md">
                        <a href="https://www.linkedin.com/in/hpsanjel/">
                            <Image src="/images/linkedin.png" alt="LinkedIn Icon" width={36} height={36} />
                        </a>
                    </li>
                    <li className="dark:bg-gray-300 hover:bg-gray-100 rounded-md">
                        <a href="https://github.com/hpsanjel">
                            <Image src="/images/github.png" alt="Github Icon" width={36} height={36} />
                        </a>
                    </li>
                    <li className="dark:bg-gray-300 hover:bg-gray-100 rounded-md">
                        <a href="https://www.facebook.com/hpsanjel/">
                            <Image src="/images/facebook.png" alt="Facebook Icon" width={36} height={36} />
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
}