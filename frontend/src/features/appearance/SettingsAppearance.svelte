<script lang="ts">
  import { settings, theme } from "$services";
  import { ChoiceList, GhostText } from "$ui";

  const modes = {
    system: { icon: "🌗", title: "Системная" },
    light: { icon: "☀️", title: "Светлая" },
    dark: { icon: "🌙", title: "Тёмная" },
  } as const satisfies Record<string, {
    icon: string,
    title: string
  }>;

  type Mode = keyof typeof modes;

  let mode = $derived(settings.get(theme.nameSetting.mode, "system") as Mode);

  function setMode(newMode: Mode) {
    theme.setMode(newMode);
    settings.set(theme.nameSetting.mode, newMode);
  }

</script>

<ChoiceList direction="horizontal"
  items={modes}
  active={mode}
  onselect={(key) => setMode(key)}
>
  {#snippet item(item, key)}
    <GhostText>
      {item.icon}
      {#if key === mode}
        {" " + item.title}
      {/if}
    </GhostText>
  {/snippet}
</ChoiceList>