<script lang="ts">
  import { modal } from "$services";
    import { Layer } from "$ui";

  interface Props {
    zindex: number
  }
  let { zindex }: Props = $props();
</script>
<Layer class="modal" zindex={zindex}>
  {#each modal.stack as entry (entry.id)}
    {@const Comp = entry.component}
    <Comp
      {...entry.props}
      onrequestclose={() => modal.close(entry.id)}
    />
  {/each}
</Layer>