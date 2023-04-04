<script>
  import service from "./related.js";

  const send = $service.send;
  $: current = $service.machine.current;
  $: context = $service.context;
</script>

{#if current === "loading"}{:else if current === "ready"}
  <div class="hero min-h-screen">
    <div class="hero-content">
      <div class="flex flex-col">
        <h1 class="text-3xl">Related Specifications</h1>
        <div>
          <div>
            <div>Title: Title of Spec</div>
            <div>Description: Description of Spec</div>
            <div>ID</div>
            <div>Forks: ID</div>
            <div>Block Height: 10000</div>
            <div>Timestamp: XXXXX</div>
            <div>Stamps: 10</div>
          </div>
          <div>
            <div>Title: Title of Spec</div>
            <div>Description: Description of Spec</div>
            <div>ID</div>
            <div>Forks: ID</div>
            <div>Block Height: 10000</div>
            <div>Timestamp: XXXXX</div>
            <div>Stamps: 10</div>
          </div>
          <div>
            <div>Title: Title of Spec</div>
            <div>Description: Description of Spec</div>
            <div>ID</div>
            <div>Forks: ID</div>
            <div>Block Height: 10000</div>
            <div>Timestamp: XXXXX</div>
            <div>Stamps: 10</div>
          </div>
          <div>
            <div>Title: Title of Spec</div>
            <div>Description: Description of Spec</div>
            <div>ID</div>
            <div>Forks: ID</div>
            <div>Block Height: 10000</div>
            <div>Timestamp: XXXXX</div>
            <div>Stamps: 10</div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
