<script lang="ts">
  import { modalStore } from "./modalStore.svelte";
</script>

{#each modalStore.stack as entry (entry.id)}
  {@const Comp = entry.component}
  <Comp
    {...entry.props}
    onrequestclose={() => modalStore.close(entry.id)}
  />
{/each}