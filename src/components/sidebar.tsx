import { h } from 'preact';
import { useState } from 'preact/hooks';

const SidebarMenu = ({ current, tx, onBack, onClick }) => {
  const handleLearnMoreClick = () => {
    console.log('click')
    onClick()
  };

  return (
    <>
      <label for="my-drawer-2" className="drawer-overlay" />
      <div className="menu bg-base-100 block w-full h-screen">
        <div className="py-2 md:pl-28 space-y-3 sticky top-0 w-[300px]">
          <div className="flex items-center">
            <svg
              width="56"
              height="60.15"
              viewBox="0 0 448 512"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32 64V448H416V64H32ZM0 32H32H416H448V64V448V480H416H32H0V448V64V32Z"
                fill="url(#paint0_linear_39_3)"
              />
              <path
                d="M32 64V448H416V64H32ZM0 32H32H416H448V64V448V480H416H32H0V448V64V32Z"
                fill="black"
              />
              <path
                d="M289 281.277L285.488 259.647L269.433 243.802L243.345 241.035H187.154L171.852 238.017C171.015 235.166 170.43 232.651 170.096 230.472C169.761 228.124 169.176 225.693 168.34 223.178V196.769L171.852 181.93L188.408 178.66L252.626 177H272.5L281.725 156.024L252.626 152H202.5L161.567 155.521L145.261 171.618L142 192.745V227.202L145.261 248.329L161.567 264.174L204.5 267.444H243.345L258.647 269.959C259.148 272.474 259.734 274.821 260.403 277.001C261.072 279.181 261.657 281.445 262.159 283.792V316.74C261.824 318.92 261.239 321.267 260.403 323.782C259.734 326.297 259.148 328.645 258.647 330.825L242.341 333.34L200 335.5L171.852 329.316H155.546L149.275 356.479L178.625 360H243.846L269.433 356.982L285.488 341.137L289 319.507V281.277Z"
                fill="#2D2D2D"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_39_3"
                  x1="224"
                  y1="32"
                  x2="224"
                  y2="480"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop />
                  <stop offset="1" stop-opacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="block px-2 text-primary font-mono text-3xl">
              <span>SPECS</span>
            </div>
          </div>

          <div className="py-2 px-2 text-primary text-2xl flex space-x-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>

            <span>Home</span>
          </div>

          <div className="py-3 px-2 space-y-2">
            {current === "ready" && (
              <a href="/create" className="btn btn-block btn-primary">
                Create Spec
              </a>
            )}
            {current === "view" && (
              <>
                <a href={`/remix/${tx}`} className="btn btn-block btn-primary">
                  Remix
                </a>
                <a href={`/related/${tx}`} className="btn btn-block btn-outline">
                  Related
                </a>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://microscope.g8way.io/?tx=${tx}`}
                  className="btn btn-block btn-outline"
                >
                  Microscope
                </a>
              </>
            )}
            {(current !== 'learn' && current !== 'view') && (
              <button className="btn btn-block btn-outline" onClick={handleLearnMoreClick}>
                Learn More
              </button>
            )}
            {(current === "learn" || current === "view") && (
              <button
                className="btn btn-block btn-outline"
                onClick={onBack}
              >
                Back
              </button>
            )}
            <label
              for="my-drawer-2"
              className="block lg:hidden btn btn-outline btn-block text-lg drawer-button"
            >
              <span className="text-primary">Close</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;
