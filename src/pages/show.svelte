<script>
  import service from "./show.js";

  export let tx;

  const send = $service.send;
  $: current = $service.machine.current;
  $: context = $service.context;
</script>

{#if current === "loading"}
  <div>Loading...</div>
{:else if current === "ready"}
  <div>{context.spec}</div>
{/if}
