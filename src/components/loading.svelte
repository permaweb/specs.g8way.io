<script>
  export let open = false;
</script>

<input type="checkbox" id="loading" class="modal-toggle" bind:checked={open} />
<div class="modal">
  <div class="modal-box">
    <div class="grid items-center justify-center bg-[#f2f3f4] p-4">
      <img class="text-center w-full" src="loader.gif" alt="loading" />
      <div class="text-center">Loading Specs...</div>
    </div>
  </div>
</div>
