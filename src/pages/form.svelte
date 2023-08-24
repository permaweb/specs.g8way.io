<script>
  import { onMount } from "svelte";
  import { router } from "tinro";
  import service from "./form.js";
  import { trim } from "ramda";

  //import Publish from "../components/publish-dialog.svelte";
  //import Config from "../components/config-dialog.svelte";

  export let tx = null;

  let editor = null;
  let showPublish = false;
  let showConfig = false;
  let showError = false;
  let showConfirm = false;
  let showFM = false;
  let loaded = false;

  let specMeta = {
    GroupId: "",
    Title: "",
    Description: "",
    Topics: "",
    Authors: "",
    Forks: "",
  };

  const s = service();
  const send = $s.send;
  $: current = $s.machine.current;
  $: context = $s.context;
  $: {
    if ($s.context?.error) {
      showError = true;
    }
  }

  onMount(async () => {
    console.log("state", current);
    editor = new EasyMDE({
      element: document.getElementById("editor"),
      minHeight: "85vh",
      autoFocus: true,
      spellChecker: false,
      indentWithTabs: false,
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "|",
        "link",
        "table",
        "code",
        "|",
        "preview",
        "side-by-side",
        "|",
        {
          name: "metadata",
          action: () => {
            showFM = true;
          },
          className: "fa fa-gear",
          text: "Metadata ",
          title: "Metadata Editor",
        },
        {
          name: "publish",
          action: () => {
            showPublish = true;
            showFM = true;
          },
          className: "fa fa-cloud-upload",
          text: "Publish ",
          title: "Publish Spec",
        },
        {
          name: "cancel",
          action: () => {
            send("reset");
            router.goto("/");
          },
          className: "fa fa-ban",
          text: "Cancel ",
          title: "Cancel Spec",
        },
      ],
    });
    editor.value("");
    send({ type: "init", tx });
  });

  async function handlePublish(e) {
    send({ type: "save", md: editor.value() });
    // router.goto("/specs");
  }

  async function updateMetadata() {
    showFM = false;
    console.log(specMeta);
    if (showPublish) {
      showPublish = false;

      send({
        type: "save",
        md: editor.value(),
        metadata: {
          ...specMeta,
          Topics:
            specMeta.Topics.length > 0
              ? specMeta.Topics.split(",").map(trim)
              : [],
          Authors:
            specMeta.Authors.length > 0
              ? specMeta.Authors.split("\n").map(trim)
              : [],
        },
      });
    }
  }

  $: {
    if (current === "ready" && !showFM) {
      if (context.spec.Title && !loaded) {
        loaded = true;
        specMeta = {
          Title: context.spec.Title,
          GroupId: context.spec.GroupId,
          Description: context.spec.Description,
          Topics:
            context.spec.Topics.length > 0
              ? context.spec.Topics.join(", ")
              : "",
          Authors:
            context.spec.Authors.length > 0
              ? context.spec.Authors.join("\n")
              : "",
          Forks: tx ? tx : "",
        };
      }

      if (editor.value() === "") {
        setTimeout(() => editor.value(context.spec.body), 100);
      }
      //setTimeout(() => editor.value(context.spec.body), 100);
    }
    if (current === "confirm") {
      showConfirm = true;
      //router.goto("/");
    }
  }
</script>

<div class="py-8 mx-8">
  <h1 class="text-primary font-mono text-2xl">SPEC Editor</h1>
</div>

<textarea id="editor" />
<!-- <Publish {doc} bind:open={showPublish} on:publish={handlePublish} /> -->
<!-- <Config bind:open={showConfig} /> -->
<input
  type="checkbox"
  id="error-modal"
  bind:checked={showError}
  class="modal-toggle"
/>
<div class="modal">
  <div class="modal-box w-[300px] px-8 py-16 mx-4 space-y-8">
    {#if context?.error && context.error.issues}
      <h3 class="text-xl text-error">Error(s)</h3>
      <ul class="flex-col items-start space-y-2">
        {#each context.error.issues as issue}
          <li>error with "{issue.path[0]}" {issue.message}</li>
        {/each}
      </ul>
    {/if}
    {#if context?.error && context.error.message}
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

<input
  type="checkbox"
  id="confirm-modal"
  bind:checked={showConfirm}
  class="modal-toggle"
/>
<div class="modal">
  <div class="modal-box w-[300px] px-8 py-16 mx-4 space-y-8">
    <h3 class="text-xl text-success">Success!</h3>
    <div class="py-8">
      <p>
        SPEC is successfully published to the Permaweb, it may take a few
        moments to show up in the list as the decentralized network and indexes
        complete processing the document.
      </p>
    </div>
    <button
      class="btn btn-outline btn-block btn-error"
      on:click={() => {
        router.goto("/");
      }}>ok</button
    >
  </div>
</div>

<input
  type="checkbox"
  id="frontmatter"
  bind:checked={showFM}
  class="modal-toggle"
/>
<div class="modal">
  <div class="modal-box w-[300px] px-8 py-16 mx-4 space-y-8">
    <button
      on:click={() => {
        showFM = false;
        showPublish = false;
      }}
      class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
    >
    <h3 class="text-xl">Metadata *</h3>
    {#if current === "ready"}
      <form on:submit|preventDefault={updateMetadata}>
        <div class="form-control">
          <label class="label">Group ID *</label>
          <input
            name="groupId"
            class="input input-bordered"
            placeholder="unique spec identifier"
            bind:value={specMeta.GroupId}
            required
          />
        </div>
        <div class="form-control">
          <label class="label">Title *</label>
          <input
            name="title"
            class="input input-bordered"
            placeholder="Spec Title"
            bind:value={specMeta.Title}
            required
          />
        </div>
        <div class="form-control">
          <label class="label">Description *</label>
          <textarea
            name="description"
            class="textarea textarea-bordered"
            placeholder="spec description"
            bind:value={specMeta.Description}
            required
          />
        </div>
        <div class="form-control">
          <label class="label">Topics</label>
          <input
            name="topics"
            class="input input-bordered"
            placeholder="list of topics"
            bind:value={specMeta.Topics}
          />
        </div>
        <div class="form-control">
          <label class="label">Authors</label>
          <textarea
            name="authors"
            class="textarea textarea-bordered"
            placeholder="place each authors wallet address on a separate line"
            bind:value={specMeta.Authors}
          />
        </div>
        {#if specMeta.forks}
          <div class="form-control">
            <label class="label">Forks</label>
            <input
              name="forks"
              class="input input-bordered"
              placeholder="forks TX"
              bind:value={specMeta.Forks}
              disabled
            />
          </div>
        {/if}
        <div class="mt-8">
          {#if showPublish}
            <button class="btn btn-block">Publish</button>
          {:else}
            <button class="btn btn-block btn-info">Update Metadata</button>
          {/if}
        </div>
      </form>
    {/if}
  </div>
</div>
