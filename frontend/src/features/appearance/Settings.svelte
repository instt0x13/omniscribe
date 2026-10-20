<script lang="ts">
  import { theme } from "$services";
  import type { ThemeMode } from "$types";
  import { Button, SelectionGroup } from "$ui";
  import ColorCard from "./components/ColorCard.svelte";
  import FontCard from "./components/FontCard.svelte";
  import OpacityContrastCard from "./components/OpacityContrastCard.svelte";
  import SpaceRadiusCard from "./components/SpaceRadiusCard.svelte";

  type ItemMode = {
    id: ThemeMode;
    title: string;
    icon: string;
  };

  const modes: ItemMode[] = [
    { id: "system", title: "Системная", icon: "" },
    { id: "light", title: "Светлая", icon: "" },
    { id: "dark", title: "Темная", icon: "" },
  ];

  // всё остальное — обычные ползунки
  const vars = [
    { obj: theme.contrast, title: "Контрастность", icon: "" },
    { obj: theme.alpha, title: "Прозрачность", icon: "" },
    { obj: theme.radius, title: "Скругление", icon: "" },
  ];
</script>

<section class="column">
  <div class="flex">
    <SelectionGroup items={modes} itemKey="id" active={theme.mode.value}>
      {#snippet item(item, active)}
        <Button variant={active ? "primary" : "default"} onclick={() => theme.mode.value = item.id}>
          {item.icon} {item.title}
        </Button>
      {/snippet}
    </SelectionGroup>
  </div>

  <hr />

  <div class="flex">
      <ColorCard role="accent" />
      <ColorCard role="primary" />
      <FontCard />
      <OpacityContrastCard />
      <SpaceRadiusCard />
  </div>

  <hr />

  <Button onclick={() => theme.reset()}>Сбросить настройки темы</Button>
</section>

<style>
  .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    gap: 0.5rem;
  }
</style>