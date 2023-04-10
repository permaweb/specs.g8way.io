<script>
  import Loading from "../components/loading.svelte";
  import Error from "../components/error.svelte";
  import { router } from "tinro";
  import service from "./show.js";
  import { take, takeLast } from "ramda";
  import { onMount } from "svelte";

  const shortHash = (h) => `${take(5, h)}...${takeLast(5, h)}`;

  export let tx;

  const send = $service.send;
  $: current = $service.machine.current;
  $: context = $service.context;

  onMount(() => {
    console.log("current", current);
    console.log("tx - mouting", tx);
    send({ type: "load", tx });
  });
</script>

{#if current === "loading"}
  <Loading open={true} />
{:else if current === "ready" || current === "doStamp" || current === "error"}
  <div class="drawer drawer-end">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <Loading open={current === "doStamp"} />
      <Error
        open={current === "error"}
        error={context.error}
        on:click={() => send("ready")}
      />
      <div class="flex md:mt-8 px-4">
        <div class="flex flex-col flex-1">
          <div class="flex w-full justify-between">
            <h3 class="text-2xl text-[#ff8500] mb-8">Specification</h3>
            <nav
              class="flex py-4 px-4 sticky top-0 items-center justify-between"
            >
              <label
                for="my-drawer-2"
                class="btn btn-ghost text-lg drawer-button"
                ><span class="text-primary">Info</span></label
              >
            </nav>
          </div>

          <div class="prose prose-invert lg:prose-xl spec-width">
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
