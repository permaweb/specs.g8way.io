<script>
  import Loading from "../components/loading.svelte";
  import Error from "../components/error.svelte";
  import { router } from "tinro";
  import service from "./show.js";
  import { take, takeLast } from "ramda";
  import { onMount } from "svelte";

  const shortHash = (h) => `${take(5, h)}...${takeLast(5, h)}`;

  export let tx;
  export let parent = false;

  let showError = false;

  const s = service();
  const send = $s.send;
  $: current = $s.machine.current;
  $: context = $s.context;

  $: {
    if ($s.context?.error) {
      showError = true;
    }
  }

  onMount(() => {
    // console.log("current", current);
    // console.log("tx - mouting", tx);
    send({ type: "load", tx });
  });
</script>

<!-- <svelte:head>
  <link
    href="https://cdn.jsdelivr.net/npm/daisyui@2.51.5/dist/full.css"
    rel="stylesheet"
    type="text/css"
  />
  <script src="https://cdn.twind.style" crossorigin></script>
</svelte:head> -->

{#if current === "loading"}
  <Loading open={true} />
{:else if current === "ready" || current === "doStamp"}
  <div class="drawer drawer-end">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <Loading open={current === "doStamp"} />
      <div class="flex md:mt-8 px-4">
        <div class="flex flex-col flex-1">
          <div class="flex w-full justify-between">
            <h3 class="text-2xl text-[#ff8500] mb-8">Specification</h3>
            <nav
              class="flex py-4 px-4 sticky top-0 items-center justify-between"
            >
              {#if !parent}
                <button class="btn btn-outline" on:click={() => send("stamp")}>
                  stamp ({context.spec.stamps})
                </button>
                <label
                  for="my-drawer-2"
                  class="btn btn-ghost text-lg drawer-button"
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
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </label>
              {/if}
            </nav>
          </div>

          <div
            class="prose prose-invert lg:prose-xl spec-width {!parent
              ? 'lg:mx-64'
              : 'mx-8'}"
          >
            {@html context.spec.html}
          </div>
        </div>
      </div>
    </div>
    <div class="drawer-side">
      <label for="my-drawer-2" class="drawer-overlay" />
      <!-- w-1/4 border-r border-slate-300 bg-white hidden md:block -->
      <div class="menu bg-base-100 block">
        <div class="py-2 space-y-3 sticky top-0 w-[400px]">
          <div class="card">
            <div class="card-body">
              <div class="card-title">Information</div>
              <h4 class="text-xl">{context.spec.Title}</h4>
              <p class="break-normal">{context.spec.Description}</p>
              <table class="table table-compact">
                <tr>
                  <th>ID</th>
                  <td>{shortHash(tx)}</td>
                </tr>
                <tr>
                  <th>GroupId</th>
                  <td>{context.spec.GroupId}</td>
                </tr>
                {#if context.spec.Forks}
                  <tr>
                    <th>Forks</th>
                    <td>{shortHash(context.spec.Forks)}</td>
                  </tr>
                {/if}
                <tr>
                  <th>Topics</th>
                  <td>{context.spec.Topics}</td>
                </tr>
                <tr>
                  <th>Stamps</th>
                  <td>{context.spec.stamps}</td>
                </tr>
              </table>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <div class="card-title">Actions</div>
              <button
                class="btn btn-sm btn-outline"
                on:click={() => send("stamp")}>STAMP</button
              >
              <a href="/related/{tx}" class="btn btn-sm btn-outline"
                >View Related</a
              >
              <a href="/remix/{tx}" class="btn btn-sm btn-outline">Remix</a>
              <button
                class="btn btn-sm btn-outline"
                on:click={async () => {
                  await send("reset");
                  router.goto("/");
                }}>Home</button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

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

<style>
  .spec-width {
    max-width: max-content;
  }

  @media only screen and (max-width: 450px) {
    .spec-width {
      width: 375px;
      max-width: 360px;
    }
  }
</style>
