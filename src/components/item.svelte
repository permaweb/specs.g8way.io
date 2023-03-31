<script>
  export let creator = {
    name: "Rakis",
    handle: "@rakis",
    avatar:
      "https://arweave.net:443/fYmFNZbRCbPhBWqmOJLNiJFoLFiFchIBSZNI6jRwWaI",
  };
  export let title = "Asset Discoverability - ANS-110";
  export let date = "32s";
</script>

<div class="mt-4">
  <div class="py-2 px-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-1">
        <!-- <img
          class="rounded-full h-14 w-14 border border-slate-50"
          src={creator.avatar}
          alt=""
          srcset=""
        /> -->
        <div class="flex items-center space-x-1">
          <!-- <div>
            <h1 class="font-bold text-primary font-mono">{creator.name}</h1>
          </div>

          <p class="text-gray-400">{creator.handle}</p>
          <span style="font-size:6px;"
            ><i class="fa fa-circle text-gray-600" /></span
          >
          <span class="text-secondary">{date}</span> -->
          <h1 class="pl-8 text-xl text-primary">
            {title}
          </h1>
        </div>
      </div>
      <div>
        <span class="text-lg text-gray-600"><i class="fa fa-ellipsis-h" /></span
        >
      </div>
    </div>

    <div class="flex mt-2 space-x-10 text-gray-500 justify-evenly">
      <span class="flex items-center"
        ><img class="h-4 w-4" src="stamp.png" alt="stamps" />15 (8)</span
      >
      <span class="flex items-center space-x-2">+1</span>
      <span class="flex items-center space-x-2">+3</span>
      <span class="flex items-center space-x-2">+5</span>
    </div>
  </div>
</div>
