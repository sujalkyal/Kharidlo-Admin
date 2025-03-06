"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";


const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("http://localhost:3001/api/auth/signin");
    }
  }, [status, router]);

  const handleLogOut = async () => {
    await signOut();
    router.push("/api/auth/signin");
  };

  return (
    <header className="w-full border-b bg-white shadow-md">
      <nav className="flex justify-between items-center py-5 px-10">
        <Link href="/">
          <div className="text-3xl font-extrabold text-gray-800 tracking-wide cursor-pointer">
            KHARID <span className="text-red-500">LO</span>
          </div>
        </Link>

        <ul className="flex space-x-8 text-lg font-medium mx-auto">
          {["/dashboard", "/products", "/customers", "/sales"].map((path) => (
            <li key={path}>
              <Link
                href={path}
                className={`hover:text-red-500 transition ${
                  pathname === path ? "border-b-2 border-red-500" : ""
                }`}
              >
                {path.replace("/", "").charAt(0).toUpperCase() +
                  path.replace("/", "").slice(1)}
              </Link>
            </li>
          ))}
          </ul>

          <ul className="flex space-x-8 text-lg font-medium">

          <li>
            {session ? (
              <button
                onClick={handleLogOut}
                className="hover:text-red-500 transition hover:cursor-pointer"
              >
                Log Out
              </button>
            ) : (
              <Link
                href="/api/auth/signin"
                className="hover:text-red-500 transition hover:cursor-pointer"
              >
                Sign Up
              </Link>
            )}
          </li>
          </ul>

      </nav>
    </header>
  );
};

export default Navbar;
