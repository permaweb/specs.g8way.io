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
  <div class="flex flex-col min-h-screen">
    <div class="hero-content ">
      <div class="flex w-full">
        <div class="flex flex-col flex-1">
          <h3 class="text-2xl text-[#ff8500]">Specification</h3>
          <div class="prose">
            {@html context.spec.html}
          </div>
        </div>
        <div class="w-1/4">
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
              <button class="btn btn-sm btn-outline">View Related</button>
              <a href="/remix/{tx}" class="btn btn-sm btn-outline">Remix</a>
              <a href="/" class="btn btn-sm btn-outline">Home</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
