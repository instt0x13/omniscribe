<script lang="ts">
  import { settings } from "$services";
  import { Button } from "$ui";
  import { backgrounds, SETTING_NAME, type BackgroundId } from "./background.config";

  let background = $derived((settings.get(SETTING_NAME, "none") as BackgroundId) || "none");

  function setBackground(newBackgroundId: BackgroundId) {
    settings.set(SETTING_NAME, newBackgroundId);
  }

  function variantActive(backgroundId: BackgroundId) {
    switch (backgroundId) {
      case background: return "primary"
      default: return "default"
    }
  }
</script>

<div class="backgrounds-choice">
  {#each backgrounds as bg}
    <Button variant={variantActive(bg.id)} onclick={() => setBackground(bg.id)}>
      {bg.title}
    </Button>
  {/each}
</div>

<style>
  .backgrounds-choice {
    display: flex;
    gap: 0.3rem;
  }
</style>