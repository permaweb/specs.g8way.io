<script>
  import { onMount } from "svelte";
  import { router } from "tinro";
  import service from "./form.js";

  import Publish from "../components/publish-dialog.svelte";
  import Config from "../components/config-dialog.svelte";

  export let asset = "";

  let editor = null;
  let showPublish = false;
  let showConfig = false;

  const send = $service.send;
  $: current = $service.machine.current;
  $: context = $service.context;

  onMount(async () => {
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
        {
          name: "config",
          action: () => {
            showConfig = true;
          },
          className: "fa fa-gear",
          text: "Config ",
          title: "Config Editor",
        },
        {
          name: "publish",
          action: () => {
            showPublish = true;
          },
          className: "fa fa-cloud-upload",
          text: "Publish ",
          title: "Publish Spec",
        },
        {
          name: "cancel",
          action: () => router.goto("/"),
          className: "fa fa-ban",
          text: "Cancel ",
          title: "Cancel Spec",
        },
      ],
    });
    // if (asset !== "") {
    //   const s = await $app.get(asset);
    //   doc.title = s.title;
    //   doc.description = s.description;
    //   doc.topics = s.topics.join(", ");
    //   editor.value(s.content);
    // }
  });

  async function handlePublish(e) {
    send({ type: "save", md: editor.value() });
    // router.goto("/specs");
  }
</script>

<div class="py-8 mx-8">
  <h1 class="text-primary font-mono text-2xl">SPEC Editor</h1>
</div>

<textarea id="editor" />
<Publish {doc} bind:open={showPublish} on:publish={handlePublish} />
<Config bind:open={showConfig} />
