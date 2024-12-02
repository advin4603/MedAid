// import { Link } from "@nextui-org/link";

import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "@/components/navbar";

export default function DefaultLayout() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    // Initial check
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-1 overflow-y-scroll">
        <Outlet />
      </main>
      {/*<footer className="w-full flex items-center justify-center py-3">*/}
      {/*  <Link*/}
      {/*    isExternal*/}
      {/*    className="flex items-center gap-1 text-current"*/}
      {/*    href="https://nextui-docs-v2.vercel.app?utm_source=next-pages-template"*/}
      {/*    title="nextui.org homepage"*/}
      {/*  >*/}
      {/*    <span className="text-default-600">Powered by</span>*/}
      {/*    <p className="text-primary">NextUI</p>*/}
      {/*  </Link>*/}
      {/*</footer>*/}
    </div>
  ) : (
    <div className="text-3xl grid place-content-center h-[100dvh]">
      This App is only Compatible with Mobile Devices :(
    </div>
  );
}
