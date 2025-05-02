"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type CardProps = {
  title: string;
  description: string;
  imageUrl: string;
  isDark?: boolean;
  isActive_?: boolean;
  toggleActive?: () => void;
};

const Card = ({
  title,
  description,
  imageUrl,
  isDark = false,
  isActive_,
  toggleActive,
}: CardProps) => {
  const [isActive, setIsActive] = useState(isActive_ || false);
  const [maxCharacters, setMaxCharacters] = useState(70);
  const router = useRouter();

  const handleClick = () => {
    setIsActive(!isActive);
    if (toggleActive) {
      toggleActive();
    }
  };

  const handleRemove = async () => {
    try {
      // Send a POST request to update the isActive status in the JSON file
      const response = await fetch("/api/updateCard", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: title,
        }),
      });
       
      if (!response.ok) {
        throw new Error("Failed to update the card");
      }

      // After successful update, refetch the updated data
      router.refresh();
      
    } catch (error) {
      console.error("Error updating the card:", error);
    }
  }



  useEffect(() => {
    if (!router) {
      return; // Handle the case where router is not available
    }

    const updateMaxCharacters = () => {
      if (window.innerWidth < 600) {
        setMaxCharacters(50);
      } else if (window.innerWidth < 800) {
        setMaxCharacters(60);
      } else if (window.innerWidth < 1000) {
        setMaxCharacters(70);
      } else if (window.innerWidth < 1200) {
        setMaxCharacters(80);
      } else {
        setMaxCharacters(100);
      }
    };

    updateMaxCharacters();
    window.addEventListener("resize", updateMaxCharacters);

    return () => {
      window.removeEventListener("resize", updateMaxCharacters);
    };
  }, [router]);
  return (
    <div
      className={`w-full h-full flex flex-col justify-between max-w-sm p-4 shadow-md rounded-xl border ${
        isDark
          ? "bg-[var(--neutral-700)] border-[var(--neutral-600)]"
          : "bg-[var(--neutral-0)] border-[var(--neutral-300)]"
      }`}
    >
      <div className="flex justify-center mb-2">
        <Image
          src={imageUrl}
          alt={title}
          width={64}
          height={64}
          className="rounded-full"
        />
        <div className="flex flex-col ml-4 ">
          <h1
            className="text-sm font-bold"
            style={{
              color: isDark ? "var(--neutral-0)" : "var(--neutral-900)",
            }}
          >
            {title}
          </h1>
          <p
            className="text-xs"
            style={{
              color: isDark ? "var(--neutral-0)" : "var(--neutral-900)",
            }}
          >


            {description.length > maxCharacters
              ? `${description.substring(0, maxCharacters)}...`
              : description}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center px-2 gap-2 ">
        <button
          onClick={handleRemove}
          className={`px-4 py-2 rounded-full border-2 transition-colors duration-300 outline-none
            ${
              isDark
                ? "bg-transparent border-[var(--neutral-300)] text-white hover:bg-[var(--neutral-600)] hover:border-[var(--red-300)]"
                : "bg-transparent border-[var(--neutral-600)] text-black hover:bg-[var(--neutral-300)] hover:border-[var(--red-300)]"
            }
          `}
        >
          Remove
        </button>

        <div
          className="cursor-pointer hover:border-[var(--red-300)]"
          onClick={handleClick}
        >
          <div
            className={`w-16 h-7 rounded-full flex items-center px-1 transition-colors duration-300 ${
              isActive ? "bg-red-400 justify-end" : "bg-gray-300 justify-start"
            }`}
          >
            <div
              className="w-5 h-5 rounded-full bg-white transition-transform duration-300"
              style={{
                transform: isActive ? "translateX(1)" : "translateX(0)",
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
