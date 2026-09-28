<script lang="ts">
  import { settings } from "$services";
  import { backgrounds, SETTING_NAME, type Background } from "./background.config";

  const background = $derived(settings.get(SETTING_NAME));
  const BgComponent = $derived(backgrounds[background as Background]?.component ?? null);
</script>

{#if BgComponent}
  <BgComponent />
{/if}