<script>
  export let tx;
</script>

<label for="my-drawer-2" class="drawer-overlay" />
<!-- w-1/4 border-r border-slate-300 bg-white hidden md:block -->
<div class="menu bg-base-100 block">
  <div class="py-2 pl-28 space-y-3 sticky top-0 w-[500px]">
    <div class="flex items-center">
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
        <path
          d="M305 281.277L301.488 259.647L285.433 243.802L259.345 241.035H203.154L187.852 238.017C187.015 235.166 186.43 232.651 186.096 230.472C185.761 228.124 185.176 225.693 184.34 223.178V196.769L187.852 181.93L204.408 178.66H268.125L291.705 183.439L297.725 156.024L268.626 152H202.652L177.567 155.521L161.261 171.618L158 192.745V227.202L161.261 248.329L177.567 264.174L202.652 267.444H259.345L274.647 269.959C275.148 272.474 275.734 274.821 276.403 277.001C277.072 279.181 277.657 281.445 278.159 283.792V316.74C277.824 318.92 277.239 321.267 276.403 323.782C275.734 326.297 275.148 328.645 274.647 330.825L258.341 333.34H196.13L171.546 329.316L165.275 356.479L194.625 360H259.846L285.433 356.982L301.488 341.137L305 319.507V281.277Z"
          fill="black"
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
      <div class="block px-2 text-primary font-mono text-3xl">
        <span>SPECS</span>
      </div>
    </div>

    <div
      class="block py-2 px-2 text-primary text-2xl flex space-x-2 items-center"
    >
      <span>Related</span>
    </div>
    <!--
    <div
      class="block group py-2 px-2 text-gray-700 hover:bg-blue-100 rounded-3xl hover:text-blue-400 text-2xl"
    >
      <i class="fa fa-hashtag mr-2" />
      <span class="font-semibold group-hover:text-blue-400  text-black">
        Explore</span
      >
    </div>
    <div
      class="block group py-2 px-2 text-gray-700 hover:bg-blue-100 rounded-3xl hover:text-blue-400 text-2xl"
    >
      <i class="fa fa-bookmark-o mr-4" />
      <span class="font-semibold group-hover:text-blue-400  text-black">
        Favorites</span
      >
    </div>
    <div
      class="block group py-2 px-2 text-gray-700 hover:bg-blue-100 rounded-3xl hover:text-blue-400 text-2xl"
    >
      <i class="fa fa-user-circle mr-4" />
      <span class="font-semibold group-hover:text-blue-400  text-black">
        Profile</span
      >
    </div>
    -->
    <div class="py-3 px-2">
      <a href="/view/{tx}" class="btn btn-block btn-primary">Return</a>
    </div>

    <!-- <div
      class=" block items-center justify-between flex group py-2 px-2 mr-6 text-gray-700 hover:bg-blue-100 rounded-full  hover:text-blue-400"
    >
      <div class="flex space-x-1">
        <img
          class="rounded-full h-14 w-14 border border-slate-50"
          src="https://arweave.net:443/fYmFNZbRCbPhBWqmOJLNiJFoLFiFchIBSZNI6jRwWaI"
          alt=""
          srcset=""
        />
        <div>
          <p class="font-semibold text-gray-800">Rakis</p>
          <span class="text-gray-600">@rakis</span>
        </div>
      </div>

      <div class="text-lg">
        <i class="fa fa-ellipsis-h" />
      </div>
    </div> -->
  </div>
</div>
