"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/icons/UiIcons";

/** Submits to /search, backed by the real Django SearchFilter (?search=). */
export default function SearchBar({ className = "" }: { className?: string }) {
  const [value, setValue] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} className={`flex w-full items-center ${className}`}>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for coconut oil, mundu, spices..."
        aria-label="Search products"
        className="w-full border border-kerala-brown/20 border-r-0 bg-white px-4 py-2.5 text-sm text-kerala-brown placeholder:text-kerala-brown/40 focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className="ease-fluid flex h-full shrink-0 items-center justify-center bg-kerala-yellow px-4 py-2.5 text-kerala-green-dark transition-colors duration-300 hover:bg-kerala-yellow-dark"
      >
        <SearchIcon className="h-5 w-5" />
      </button>
    </form>
  );
}
