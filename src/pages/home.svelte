<script>
  import Sidebar from "../components/sidebar.svelte";
  import Item from "../components/item.svelte";
  import service from "./home";

  const send = $service.send;
  $: current = $service.machine.current;
  $: context = $service.context;

  const items = [
    {
      creator: {
        name: "Rakis",
        handle: "@rakis",
        avatar:
          "https://arweave.net:443/fYmFNZbRCbPhBWqmOJLNiJFoLFiFchIBSZNI6jRwWaI",
      },
      title: "ANS-110 - Asset Discovery",
    },
    {
      creator: {
        name: "JShaw",
        handle: "@jshaw",
        avatar:
          "https://arweave.net/5wxPrv_WoZz0CU_GnTsQDOEnWIipcwiNbtoPzesq3gQ",
      },
      title: "ANS-108 - Render-With",
    },
  ];
</script>

<div class="drawer drawer-mobile">
  <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col items-center justify-start">
    <!-- Page content here -->
    <div
      class="w-full md:w-4/5 border-l border-r border-slate-300 min-h-screen"
    >
      <nav
        class="flex py-4 px-4 sticky top-0 border-b border-slate-300 items-center justify-between"
      >
        <label for="my-drawer-2" class="btn btn-ghost text-lg drawer-button"
          ><span class="text-primary">Home</span></label
        >

        <a href="/create" class="btn btn-ghost btn-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 text-primary"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </a>
      </nav>
      {#if current === "loading"}
        <div class="grid items-center">
          <img
            src="https://arweave.net/IkMJRqi_0Xx_QhstK4WE3rsQqQxC07n84UagPgqGXfc"
            alt="loading"
          />
        </div>
      {:else if current === "ready"}
        <div class=" overflow-hidden">
          {#each context.specs as item}
            <Item {...item} />
          {/each}
        </div>
      {/if}
    </div>
  </div>
  <div class="drawer-side">
    <Sidebar />
  </div>
</div>
