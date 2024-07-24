"use client";

import React, { useState, useEffect, useRef } from "react";
import Wrapper from "./Wrapper";
import Link from "next/link";
import Menu from "./Menu";
import MenuMobile from "./MenuMobile";
import Image from "next/image";

import { IoMdHeartEmpty } from "react-icons/io";
import { BsCart } from "react-icons/bs";
import { BiMenuAltRight } from "react-icons/bi";
import { VscChromeClose } from "react-icons/vsc";
import { AiOutlineSearch } from "react-icons/ai";
import { fetchDataFromApi } from "@/utils/api";
import { useSelector } from "react-redux";

const Header = (data) => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showCatMenu, setShowCatMenu] = useState(false);
  const [show, setShow] = useState("translate-y-0");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [categories, setCategories] = useState([]);
  const { cartItems } = useSelector((state) => state.cart);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [mobileSearch, setMobileSearch] = useState(false);

  const searchInputRef = useRef(null);

  const p = data.attributes;

  const controlNavbar = () => {
    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY && !mobileMenu) {
        setShow("-translate-y-[80px]");
      } else {
        setShow("shadow-sm");
      }
    } else {
      setShow("translate-y-0");
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetchDataFromApi("/api/products?populate=*");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const filteredResults = categories.filter((item) =>
          item.attributes.name
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase())
        );
        setSearchResults(filteredResults);
        setDropdownOpen(true);
      } catch (error) {
        console.error("Error during search:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setDropdownOpen(false);
    }
  };

  const handleSelectProduct = (slug) => {
    setDropdownOpen(false);
    window.location.href = `/product/${slug}`;
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        prevIndex < searchResults.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
        handleSelectProduct(searchResults[selectedIndex].attributes.slug);
      }
    }
  };

  useEffect(() => {
    const handleKeyDownEvent = (e) => {
      if (dropdownOpen) {
        handleKeyDown(e);
      }
    };

    window.addEventListener("keydown", handleKeyDownEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDownEvent);
    };
  }, [dropdownOpen, searchResults, selectedIndex]);

  useEffect(() => {
    if (mobileSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [mobileSearch]);

  const handleClickOutside = (event) => {
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target)
    ) {
      setMobileSearch(false);
      setSearchQuery("");
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (mobileSearch) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [mobileSearch]);

  return (
    <header
      className={`w-full h-[50px] md:h-[80px] bg-white flex items-center justify-between z-20 sticky top-0 transition-transform duration-300 ${show}`}
    >
      <Wrapper className="h-[60px] flex justify-between items-center">
        <Link href="/">
          <img src="/logo.svg" className="w-[40px] md:w-[60px]" />
        </Link>

        <Menu
          showCatMenu={showCatMenu}
          setShowCatMenu={setShowCatMenu} // Ensure this is correctly passed
          setMobileMenu={setMobileMenu}
          categories={categories}
        />

        {mobileMenu && (
          <MenuMobile
            showCatMenu={showCatMenu}
            setShowCatMenu={setShowCatMenu}
            setMobileMenu={setMobileMenu}
            categories={categories}
          />
        )}

        <div className="flex items-center gap-2 text-black relative">
          {/* Search input and button */}
          <div className="relative flex items-center">
            {!mobileSearch && (
              <AiOutlineSearch
                className="text-lg md:hidden cursor-pointer"
                onClick={() => setMobileSearch(true)}
              />
            )}

            {(mobileSearch || window.innerWidth >= 768) && (
              <input
                type="text"
                ref={searchInputRef}
                className={`border border-gray-300 rounded-full px-3 py-1.5 md:py-2 text-sm md:text-base focus:outline-none ${
                  mobileSearch ? "w-40" : "w-20"
                } md:w-full`}
                placeholder="Search products"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch();
                  setSelectedIndex(-1);
                }}
                onFocus={() => setDropdownOpen(searchResults.length > 0)}
              />
            )}
            <AiOutlineSearch
              className="absolute right-2 text-lg cursor-pointer hidden md:block"
              onClick={handleSearch}
            />
          </div>

          {/* Search results dropdown */}
          {dropdownOpen && searchResults.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {searchResults.map((result, index) => {
                const imageUrl =
                  result.attributes.images?.data?.[0]?.attributes?.url ||
                  "/default-image.jpg";
                return (
                  <div
                    key={result.id}
                    className={`flex items-center px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer ${
                      index === selectedIndex ? "bg-gray-200" : ""
                    }`}
                    onClick={() => handleSelectProduct(result.attributes.slug)}
                  >
                    <span>{result.attributes.name}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Wishlist button */}
          <div className="flex items-center gap-2 text-black">
            <div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative">
              <IoMdHeartEmpty className="text-[19px] md:text-[24px]" />
              <div className="h-[14px] md:h-[18px] min-w-[14px] md:min-w-[18px] rounded-full bg-red-600 absolute top-1 left-5 md:left-7 text-white text-[10px] md:text-[12px] flex justify-center items-center px-[2px] md:px-[5px]">
                51
              </div>
            </div>

            {/* Cart button */}
            <Link href="/cart">
              <div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative">
                <BsCart className="text-[15px] md:text-[20px]" />
                {cartItems.length > 0 && (
                  <div className="h-[14px] md:h-[18px] min-w-[14px] md:min-w-[18px] rounded-full bg-red-600 absolute top-1 left-5 md:left-7 text-white text-[10px] md:text-[12px] flex justify-center items-center px-[2px] md:px-[5px]">
                    {cartItems.length}
                  </div>
                )}
              </div>
            </Link>

            {/* Mobile menu toggle button */}
            <div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative -mr-2 md:hidden">
              {mobileMenu ? (
                <VscChromeClose
                  className="text-[16px] md:text-[24px]"
                  onClick={() => setMobileMenu(false)}
                />
              ) : (
                <BiMenuAltRight
                  className="text-[20px] md:text-[24px]"
                  onClick={() => setMobileMenu(true)}
                />
              )}
            </div>
          </div>
        </div>
      </Wrapper>
    </header>
  );
};

export default Header;
