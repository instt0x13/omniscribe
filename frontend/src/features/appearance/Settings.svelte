<script lang="ts">
  import { theme } from "$services";
  import type { ThemeMode } from "$types";
  import { Button, SelectionGroup } from "$ui";
  import ColorCard from "./components/ColorCard.svelte";
  import FontCard from "./components/FontCard.svelte";
  import OpacityIntensityCard from "./components/OpacityIntensityCard.svelte";
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
</script>

<section class="settings">
  <div class="settings__modes">
    <SelectionGroup items={modes} itemKey="id" active={theme.mode.value}>
      {#snippet item(item, active)}
        <Button variant={active ? "primary" : "default"} onclick={() => theme.mode.value = item.id}>
          {item.icon} {item.title}
        </Button>
      {/snippet}
    </SelectionGroup>
  </div>

  <div class="settings__carts">
      <ColorCard role="accent" />
      <ColorCard role="primary" />
      <OpacityIntensityCard />
      <FontCard />
      <SpaceRadiusCard />
  </div>

  <Button onclick={() => theme.reset()}>Сбросить настройки темы</Button>
</section>

<style>
  .settings {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xl);
  }

  .settings__modes {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    gap: var(--space);
  }

  .settings__carts {
    --size: 7rem;
    --bar: 1rem;
    --gap: 0.3rem;
    
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    gap: var(--space);
  }
</style>