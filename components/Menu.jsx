import Link from "next/link";
import React, { useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import PropTypes from 'prop-types';

const data = [
  { id: 1, name: "Home", url: "/" },
  { id: 2, name: "About", url: "/about" },
  { id: 3, name: "Categories", subMenu: true },
  { id: 4, name: "Contact", url: "/contact" },
];


const Menu = ({showCatMenu, setShowCatMenu, categories,}) => {

  return (
    <ul className="hidden md:flex items-center gap-8 font-medium text-black ">
      {data.map((item) => (
        <React.Fragment key={item.id}>
          {!!item?.subMenu ? (
            <li
              className="cursor-pointer flex items-center gap-2 relative"
              onMouseEnter={() => setShowCatMenu(true)}
              onMouseLeave={() => setShowCatMenu(false)}
            >
              {item.name}
              <BsChevronDown size={14} />

              {showCatMenu && (
                <ul className="bg-white absolute top-6 left-0 min-w-[250px] px-1 py-1 text-black shadow-lg">
                  {categories?.map(({attributes: c, id}) => (
                    <Link
                      key={id}
                      href={`/category/${c.slug}`}
                      onClick={() => setShowCatMenu(false)}
                    >
                      <li className="h-12 flex justify-between items-center px-3 hover:bg-black/[0.03] rounded-md">
                        {c.name}
                        <span className="opacity-50 text-sm">
                          {`(${c.products.data.length})`}
                        </span>
                      </li>
                    </Link>
                  ))}
                </ul>
              )}
            </li>
          ) : (
            <li className="cursor-pointer">
              <Link href={item.url}>{item.name}</Link>
            </li>
          )}
        </React.Fragment>
      ))}
    </ul>
  );
};

Menu.propTypes = {
  showCatMenu: PropTypes.bool.isRequired,
  setShowCatMenu: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      attributes: PropTypes.shape({
        name: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        products: PropTypes.shape({
          data: PropTypes.array.isRequired,
        }).isRequired,
      }).isRequired,
    })
  ).isRequired,
};


export default Menu;
