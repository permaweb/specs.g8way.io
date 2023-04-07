<script>
  import service from "./show.js";

  export let tx;

  const send = $service.send;
  $: current = $service.machine.current;
  $: context = $service.context;

  $: {
    if (current === "idle") {
      send({ type: "load", tx });
    }
  }
</script>

{#if current === "loading"}
  <div>Loading...</div>
{:else if current === "ready"}
  <div class="drawer drawer-end">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
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
        <div class="py-2 space-y-3 sticky top-0 w-[350px]">
          <div class="card">
            <div class="card-body">
              <div class="card-title">Information</div>
              <table class="table">
                <tr>
                  <th>ID</th>
                  <td>{tx}</td>
                </tr>
                <tr>
                  <th>GroupId</th>
                  <td>{context.spec.GroupId}</td>
                </tr>
                {#if context.spec.Forks}
                  <tr>
                    <th>Forks</th>
                    <td>{context.spec.Forks}</td>
                  </tr>
                {/if}
                <tr>
                  <th>Title</th>
                  <td>{context.spec.Title}</td>
                </tr>
                <tr>
                  <th>Description</th>
                  <td>{context.spec.Description}</td>
                </tr>
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
              <button class="btn btn-sm btn-outline">STAMP</button>
              <a href="/related/{tx}" class="btn btn-sm btn-outline"
                >View Related</a
              >
              <a href="/remix/{tx}" class="btn btn-sm btn-outline">Remix</a>
              <a href="/" class="btn btn-sm btn-outline">Home</a>
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
