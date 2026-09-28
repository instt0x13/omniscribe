<script lang="ts">
  import { layerViews } from "$views";
</script>

{#each layerViews.items as layer, i (layer.id)}
  {@const Layer = layer.component}
  <div class="layer" style:z-index={i + 1}>
    <Layer />
  </div>
{/each}

<style>
  .layer {
    position: relative;
  }
</style>