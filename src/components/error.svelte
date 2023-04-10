<script>
  export let open = false;
  export let error = "Unknown Error";
</script>

<input type="checkbox" id="error" class="modal-toggle" bind:checked={open} />
<div class="modal">
  <div class="modal-box">
    <div class="grid items-center justify-center bg-[#f2f3f4] p-4">
      <div class="my-8">
        An error occurred while trying to stamp specification.
      </div>
      <div class="my-4">
        {error}
      </div>
      <button class="btn btn-sm btn-error" on:click>OK</button>
    </div>
  </div>
</div>
