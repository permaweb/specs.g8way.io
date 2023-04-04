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

  const send = $service.send;
  $: current = $service.machine.current;
  $: context = $service.context;

  console.log("tx", tx);

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
          action: () => router.goto("/"),
          className: "fa fa-ban",
          text: "Cancel ",
          title: "Cancel Spec",
        },
      ],
    });
    send({ type: "init", tx });
  });

  async function handlePublish(e) {
    send({ type: "save", md: editor.value() });
    // router.goto("/specs");
  }

  $: {
    if (current === "ready") {
      setTimeout(() => {
        editor.value(context.markdown);
      }, 100);
    }
    if (current === "confirm") {
      console.log(context);
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
