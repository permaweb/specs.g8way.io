<script>
  import { take, takeLast } from "ramda";
  export let creator = {
    name: "Rakis",
    handle: "@rakis",
    avatar:
      "https://arweave.net:443/fYmFNZbRCbPhBWqmOJLNiJFoLFiFchIBSZNI6jRwWaI",
  };
  export let id = "";
  export let title = "Asset Discoverability - ANS-110";
  export let groupId = null;
  export let height = "pending";
  export let stamps = 0;
  export let forks, description, owner, type;

  const shortHash = (h) => `${take(5, h)}...${takeLast(5, h)}`;
</script>

<div class="pt-4 border-b-2 border-black-500 hover:bg-gray-100" on:click>
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
            {groupId ? `(${groupId})` : ""}
          </h1>
        </div>
      </div>
      <div>
        <a
          class="btn btn-sm btn-ghost float-right btn-primary"
          href="/view/{id}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </a>
        <!-- <span class="text-lg text-gray-600"><i class="fa fa-ellipsis-h" /></span
        > -->
      </div>
    </div>

    <div class="flex mt-2 space-x-10 text-gray-500 place-content-end">
      <span class="flex items-end"
        >id: {shortHash(id)}
        <a
          href="https://viewblock.io/arweave/tx/{id}"
          class="btn btn-ghost btn-sm mt-2 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
            />
          </svg>
        </a></span
      >
      <span class="flex items-end">Stamps: ({stamps})</span>
      <span class="flex space-x-2 items-end">Height: {height}</span>
      <!-- <span class="flex items-center space-x-2">+3</span>
      <span class="flex items-center space-x-2">+5</span> -->
    </div>
  </div>
</div>
