"use client";

import CardGrid from "@/components/card_grid";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [currentSortingMethod, setCurrentSortingMethod] = useState<"all" | "active" | "inactive">("all");
  const [showExtensionList, setShowExtensionList] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setShowExtensionList(false);
      } else {
        setShowExtensionList(true);
      }
    };

    handleResize(); // Call it once on mount
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };
    darkMode.addEventListener("change", handleChange);
    setIsDark(darkMode.matches);
    return () => {
      darkMode.removeEventListener("change", handleChange);
    };
  }, []);

  const toggleTheme = () => {
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)");
    if (darkMode) {
      if (isDark) {
        setIsDark(false);
        document.documentElement.classList.remove("dark");
        return;
      }

      setIsDark(true);
      document.documentElement.classList.add("dark");
      return;
    }
    return;
  };

  return (
    <div
      className={`w-screen flex flex-col min-h-screen items-center py-[2rem] ${isDark ? "dark-gradient-bg" : "light-gradient-bg"}`}
    >
      <div
        className={`w-[calc(100vw-4rem)] ${isDark ? "bg-[var(--neutral-700)] border-[var(--neutral-600)]" : "bg-[var(--neutral-0)] border-[var(--neutral-300)]"} border-2  h-[10vh] rounded-sm flex items-center justify-between p-10`}
      >
        <h1
          className={`text-[2rem] font-bold `}
          style={{ color: isDark ? "var(--neutral-0)" : "var(--neutral-900)" }}
        >
          Extensions
        </h1>
        <Image
          src={
            isDark
              ? "/assets/images/icon-sun.svg"
              : "/assets/images/icon-moon.svg"
          }
          alt="Toggle Theme"
          width={50}
          height={50}
          className="cursor-pointer"
          onClick={toggleTheme}
          role="button"
          tabIndex={0}
        />
      </div>
      <div
        className={`w-[calc(100vw-4rem)] my-10 h-[10vh] rounded-sm flex items-center p-10 ${showExtensionList ? "justify-between" : "justify-center"}`}
      >
        {showExtensionList && (
          <h1
            className={`text-[2rem] font-bold `}
            style={{ color: isDark ? "var(--neutral-0)" : "var(--neutral-900)" }}
          >
            Extension List
          </h1>
        )}
        <div className="flex items-center gap-4">
          {["all", "active", "inactive"].map((method) => {
            const isActive = currentSortingMethod === method;

            return (
              <button
                key={method}
                onClick={() => setCurrentSortingMethod(method as "all" | "active" | "inactive")}
                className={`text-[1.5rem] font-bold rounded-full px-4 py-1 border transition-colors duration-200
                  ${isActive
                    ? "bg-[var(--red-500)] border-[var(--red-700)] text-[var(--neutral-0)]"
                    : "bg-[var(--neutral-400)] border-[var(--neutral-500)] text-[var(--neutral-500)]"}
                `}
              >
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </button>
            );
          })}
        </div>


      </div>
      <div className="w-[calc(100vw-4rem)] mt-10">
        <CardGrid isDark={isDark} sortingMethod={currentSortingMethod}/>
      </div>
    </div>
  );
}
