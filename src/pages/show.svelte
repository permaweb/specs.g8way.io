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
        <div class="w-[300px]">
          <h3 class="text-2xl text-[#ff8500]">Information</h3>

          <div class="card">
            <div class="card-body">
              <div class="card-title">Identifier</div>
              <a href="https://viewblock.io/arweave/tx/{tx}">{tx}</a>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <div class="card-title">Title</div>
              {context.spec.Title}
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <div class="card-title">Description</div>
              {context.spec.Description}
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <div class="card-title">Stamps</div>
              <small
                >(stamping the specification is a vote towards standardization
                for this version, you must be vouched to STAMP)</small
              >
              5
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <div class="card-title">Actions</div>
              <button class="btn btn-sm btn-outline">STAMP</button>
              <button class="btn btn-sm btn-outline">View Related</button>
              <button class="btn btn-sm btn-outline">Remix</button>
              <a href="/" class="btn btn-sm btn-outline">Home</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
