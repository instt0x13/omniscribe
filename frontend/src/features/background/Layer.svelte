<script lang="ts">
  import { settings } from "$services";
  import { Layer } from "$ui";
  import { backgrounds, SETTING_NAME, type BackgroundId } from "./background.config";

  interface Props {
    zindex: number;
  }
  let { zindex }: Props = $props();

  const backgroundId = $derived(settings.get(SETTING_NAME) as BackgroundId);
  
  // Ищем компонент в массиве по id
  const BgComponent = $derived(
    backgrounds.find((b) => b.id === backgroundId)?.component ?? null
  );
</script>

{#if BgComponent}
  <Layer class="background" zindex={zindex}>
    <BgComponent />
  </Layer>
{/if}