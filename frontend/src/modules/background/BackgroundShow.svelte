<script lang="ts">
  import { settings } from "$services";
  import { backgrounds, SETTING_NAME } from "./background.config";
</script>

{#each Object.entries(backgrounds) as [key, value]}
  {#if key === settings.get(SETTING_NAME)}
    {#if value.component !== null}
      {@const BgComponent = value.component}
      <BgComponent />
    {/if}
  {/if}
{/each}