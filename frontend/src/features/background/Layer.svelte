<script lang="ts">
  import { settings } from "$services";
  import { Layer } from "$ui";
  import { backgrounds, SETTING_NAME, type Background } from "./background.config";

  interface Props {
    zindex: number
  }
  let { zindex }: Props = $props();

  const background = $derived(settings.get(SETTING_NAME));
  const BgComponent = $derived(backgrounds[background as Background]?.component ?? null);
</script>

{#if BgComponent}
  <Layer class="background" zindex={zindex}>
    <BgComponent />
  </Layer>
{/if}