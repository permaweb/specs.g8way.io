<script>
  import { Route, router } from "tinro";
  import Announcer from "./components/announcer.svelte";
  import Transition from "./components/transition.svelte";

  import Home from "./pages/home.svelte";
  import Form from "./pages/form.svelte";
  import Show from "./pages/show.svelte";

  const tx = new URLSearchParams(location.search).get("tx");
  router.mode.hash();
  router.subscribe((_) => window.scrollTo(0, 0));
</script>

<Announcer />
<Transition>
  <Route path="/">
    {#if tx}
      <Show {tx} />
    {:else}
      <Home />
    {/if}
  </Route>
  <Route path="/create">
    <Form />
  </Route>
</Transition>
