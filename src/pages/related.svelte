<script>
  import service from "./related.js";
  import Sidebar from "../components/sidebar.svelte";
  import Item from "../components/item.svelte";

  export let tx = null;

  const send = $service.send;
  $: current = $service.machine.current;
  $: context = $service.context;

  $: {
    if (current === "idle") {
      send({ type: "load", tx });
    }
  }
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
          ><span class="text-primary">Related Versions</span></label
        >
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
