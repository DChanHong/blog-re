"use client";

import { IoSearch } from "react-icons/io5";

/**
 * SearchBar
 *
 * Read-only visual search input used inside the mobile navigation.
 * Hook actual search logic when available.
 */
export default function SearchBar() {
    return (
        <div className="flex border-2 mb-6 rounded-xl p-1 justify-between m-4">
            <input className="mx-2 p-1 outline-none" type="text" placeholder="Search for Keyword" />
            <button type="button">
                <IoSearch size={30} />
            </button>
        </div>
    );
}
