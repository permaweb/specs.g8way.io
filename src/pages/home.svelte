<script>
  import Sidebar from "../components/sidebar.svelte";
  import Item from "../components/item.svelte";
  import Spec from "./show.svelte";
  import Learn from "./learn.svelte";

  import service from "./home";

  const s = service();

  const send = $s.send;
  $: current = $s.machine.current;
  $: context = $s.context;
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
        {#if current !== "view" && current !== "stamping" && current !== "learn"}
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
        {:else if current === "view" || current === "stamping"}
          <button class="btn btn-ghost" on:click={() => send("back")}>
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
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          {#if current === "stamping"}
            Stamping...
          {:else}
            <button
              class="btn btn-outline btn-primary"
              on:click={() => send("stamp")}
            >
              stamp ({context.selected.stamps})
            </button>
          {/if}
        {:else if current === "learn"}
          <button class="btn btn-ghost" on:click={() => send("back")}>
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
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        {/if}
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
            <Item
              {...item}
              on:click={() => send({ type: "show", selected: item })}
            />
          {/each}
        </div>
      {:else if current === "view" || current === "stamping"}
        <Spec tx={context.selected.id} parent={true} />
      {:else if current === "learn"}
        <Learn />
      {/if}
    </div>
  </div>
  <div class="drawer-side">
    <Sidebar
      on:back={() => send("back")}
      on:click={() => send("learn")}
      {current}
      tx={context?.selected?.id}
    />
  </div>
</div>
