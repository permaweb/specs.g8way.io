<script>
  import { Route, router } from "tinro";
  import Announcer from "./components/announcer.svelte";
  import Transition from "./components/transition.svelte";

  import Home from "./pages/home.svelte";
  import Form from "./pages/form.svelte";
  import Show from "./pages/show.svelte";
  import Related from "./pages/related.svelte";
  import Learn from "./pages/learn.svelte";

  const tx = new URLSearchParams(location.search).get("tx");
  router.mode.hash();
  router.subscribe((_) => window.scrollTo(0, 0));
</script>

<Announcer />
<Transition>
  <Route path="/" let:meta>
    {#if tx}
      <Show {tx} />
    {:else}
      <Home />
    {/if}
  </Route>
  <Route path="/create">
    <Form />
  </Route>
  <Route path="/view/:tx" let:meta>
    <Show tx={meta.params.tx} />
  </Route>
  <Route path="/remix/:tx" let:meta>
    <Form tx={meta.params.tx} />
  </Route>
  <Route path="/related/:tx" let:meta>
    <Related tx={meta.params.tx} />
  </Route>
  <Route path="/learn">
    <Learn />
  </Route>
</Transition>
