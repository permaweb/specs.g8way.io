<script>
  import Sidebar from "../components/sidebar.svelte";
  import Item from "../components/item.svelte";
  import Spec from "./show.svelte";
  import Learn from "./learn.svelte";

  import service from "./home";

  let showError = false;

  const s = service();

  const send = $s.send;
  $: current = $s.machine.current;
  $: context = $s.context;

  $: copying = false;

  $: {
    if ($s.context?.error) {
      showError = true;
    }
  }

  function handleCopy() {
    copying = true;
    setTimeout(() => (copying = false), 2000);
    const spec = `${window.location.origin}/?tx=${context.selected.id}`;
    window.navigator.clipboard.writeText(spec);
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
            <div class="flex space-x-2 items-center">
              <span class="line-clamp-1"
                >{window.location.origin}/?tx={context.selected.id}</span
              >
              <button class="btn btn-sm btn-ghost" on:click={handleCopy}>
                {#if copying}
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
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                {:else}
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
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                    />
                  </svg>
                {/if}
              </button>
            </div>
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

<input
  type="checkbox"
  id="error-modal"
  bind:checked={showError}
  class="modal-toggle"
/>
<div class="modal">
  <div class="modal-box w-[300px] px-8 py-16 mx-4 space-y-8">
    {#if context?.error}
      <h3 class="text-xl text-error">Error(s)</h3>
      <div class="text-sm">{context.error.message}</div>
    {/if}
    <button
      class="btn btn-outline btn-block btn-error"
      on:click={() => {
        send("reset");
        showError = false;
      }}>close</button
    >
  </div>
</div>
