"use client";

import React, { useEffect, useState } from "react";
import Card from "./card"; // Assuming Card component is in the same directory

const CardGrid = ({ isDark = false, sortingMethod = "all" }: { isDark: boolean; sortingMethod?: "all" | "active" | "inactive" }) => {
  interface Card {
    name: string;
    description: string;
    logo: string;
    isActive: boolean;
  }

  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/data.json", { cache: "no-store" });
      const data = await response.json();
      if (sortingMethod === "active") {
        setCards(data.filter((card: Card) => card.isActive));
     } else if (sortingMethod === "inactive") {
        setCards(data.filter((card: Card) => !card.isActive));
      } else {
        setCards(data);
      }
    };
  
    fetchData(); // Fetch immediately on mount
  
    const interval = setInterval(fetchData, 5000); // Poll every 5s
  
    return () => clearInterval(interval); // Clean up on unmount
  }, [sortingMethod]);
  

  const toggleCardActive = async (name: string, isActive: boolean) => {
    try {
      // Send a POST request to update the isActive status in the JSON file
      const response = await fetch("/api/updateCard", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          isActive: !isActive,
        }),
      });
       
      if (!response.ok) {
        throw new Error("Failed to update the card");
      }

      // After successful update, refetch the updated data
      const updatedResponse = await fetch("/data.json");
      const updatedData = await updatedResponse.json();
      setCards(updatedData);
      
    } catch (error) {
      console.error("Error updating the card:", error);
    }
  };

  return (
    <div className="w-[calc(100vw-2rem)] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 px-6 py-8">
    {cards.map((card) => (
      <div key={card.name} className="w-full h-[25vh]">
        <Card
          title={card.name}
          description={card.description}
          imageUrl={card.logo}
          isDark={isDark}
          isActive_={card.isActive}
          toggleActive={() => toggleCardActive(card.name, card.isActive)}
        />
      </div>
    ))}
  </div>

  );
};

export default CardGrid;
