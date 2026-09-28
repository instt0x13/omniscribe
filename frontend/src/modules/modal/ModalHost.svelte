<script lang="ts">
  import { modal } from "$services";
</script>

{#each modal.stack as entry (entry.id)}
  {@const Comp = entry.component}
  <Comp
    {...entry.props}
    onrequestclose={() => modal.close(entry.id)}
  />
{/each}