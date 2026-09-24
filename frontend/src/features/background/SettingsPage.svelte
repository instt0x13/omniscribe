<script lang="ts">
  import { settings } from "$shared/services";
  import { GhostText, ChoiceList } from "$shared/ui";
  import { backgrounds, SETTING_NAME, type Background } from "./background.config";

  let background = $derived((settings.get(SETTING_NAME, "system") as Background) || "system");

  function setBackground(newBackground: Background) {
    settings.set(SETTING_NAME, newBackground);
  }
</script>

<ChoiceList direction="horizontal"
  items={backgrounds}
  active={background}
  onselect={(b) => {setBackground(b);}}
>
  {#snippet item(b)}
    <GhostText>{b.title}</GhostText>
  {/snippet}
</ChoiceList>