"use client";
import { useParams } from "next/navigation";
import { NavBar } from "./base-navbar/base-navbar";
import React from "react";
export default function BasePage() {
  const params = useParams(); // Access the dynamic route parameters
  const { base } = params; // Destructure to get the 'base' value
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <main>
      <NavBar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <h1>Dynamic Base Page: {base}</h1>
      {/* You can display or use the base variable here */}
    </main>
  );
}
