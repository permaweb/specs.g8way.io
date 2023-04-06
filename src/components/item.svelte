<script>
  export let creator = {
    name: 'Rakis',
    handle: '@rakis',
    avatar:
      'https://arweave.net:443/fYmFNZbRCbPhBWqmOJLNiJFoLFiFchIBSZNI6jRwWaI',
  };
  export let id = '';
  export let title = 'Asset Discoverability - ANS-110';
  export let groupId = 'ANS-110';
  export let height = 'pending';
</script>

<div class="mt-4 border-b-2 border-black-500">
  <div class="py-2 px-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-1">
        <!-- <img
          class="rounded-full h-14 w-14 border border-slate-50"
          src={creator.avatar}
          alt=""
          srcset=""
        /> -->
        <div class="flex items-center space-x-1">
          <!-- <div>
            <h1 class="font-bold text-primary font-mono">{creator.name}</h1>
          </div>

          <p class="text-gray-400">{creator.handle}</p>
          <span style="font-size:6px;"
            ><i class="fa fa-circle text-gray-600" /></span
          >
          <span class="text-secondary">{date}</span> -->
          <h1 class="pl-8 text-xl text-primary">
            {title} ({groupId})
          </h1>
        </div>
      </div>
      <div>
        <a
          class="btn btn-sm btn-outline float-right btn-primary"
          href="/view?tx={id}">View Spec</a
        >
        <!-- <span class="text-lg text-gray-600"><i class="fa fa-ellipsis-h" /></span
        > -->
      </div>
    </div>

    <div class="flex mt-2 space-x-10 text-gray-500 place-content-end">
      <span class="flex items-end">Stamps: (8)</span>
      <span class="flex space-x-2 items-end">Height: 1000</span>
      <!-- <span class="flex items-center space-x-2">+3</span>
      <span class="flex items-center space-x-2">+5</span> -->
    </div>
  </div>
</div>
