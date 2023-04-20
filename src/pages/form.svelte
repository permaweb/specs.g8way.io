<script>
  import { onMount } from "svelte";
  import { router } from "tinro";
  import service from "./form.js";

  //import Publish from "../components/publish-dialog.svelte";
  //import Config from "../components/config-dialog.svelte";

  export let tx = null;

  let editor = null;
  let showPublish = false;
  let showConfig = false;
  let showError = false;

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
        // {
        //   name: "config",
        //   action: () => {
        //     showConfig = true;
        //   },
        //   className: "fa fa-gear",
        //   text: "Config ",
        //   title: "Config Editor",
        // },
        {
          name: "publish",
          action: () => {
            send({ type: "save", md: editor.value() });
            //showPublish = true;
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

  $: {
    if (current === "ready") {
      const fm = context.spec.frontmatter
        .split("\n")
        .map((s) => {
          if (/Forks/.test(s)) {
            return "";
          }
          return s;
        })
        .join("\n");

      setTimeout(() => {
        editor.value(`---
${fm}
${tx ? "Forks: " + tx : ""}

---

${context.spec.body}
        `);
      }, 100);
    }
    if (current === "confirm") {
      router.goto("/");
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
