<script lang="ts">
  import { settings, theme } from "$services";
  import type { ThemeMode } from "$types";
  import { SelectionGroup } from "$ui";

  const vars = [
    {obj: theme.hue, title: "Оттенок", icon: ""},
    {obj: theme.sat, title: "Насыщенность", icon: ""},
    {obj: theme.primaryH, title: "Оттенок основного цвета", icon: ""},
    {obj: theme.primaryS, title: "Насыщенность основного", icon: ""},
    {obj: theme.contrast, title: "Контрастность", icon: ""},
    {obj: theme.alpha, title: "Прозрачность", icon: ""},
    {obj: theme.radius, title: "Скругление", icon: ""},
    {obj: theme.fontSize, title: "Размер шрифта", icon: ""},
  ]

  type ItemMode = {
    id: ThemeMode,
    title: string,
    icon: string,
  }

  const modes: ItemMode[] = [
    {id: "system", title: "Системная", icon: ""},
    {id: "light", title: "Светлая", icon: ""},
    {id: "dark", title: "Темная", icon: ""},
  ]

</script>

<section class="column">
  <div class="flex">
    <SelectionGroup
      items={modes}
      itemKey='id'
      active={theme.mode.value}
    >
      {#snippet item(item, active)}
        <button class:active onclick={() => theme.mode.value = item.id}>
          {item.icon} {item.title}
        </button>
      {/snippet}
    </SelectionGroup>
  </div>
  <hr>
  <div class="flex">
    {#each vars as variable}

      <div class="theme-variable">
        <div class="theme-variable__header">
          <sapn>{variable.title}</sapn>

          <label class="theme-variable__value">
            <input
              type="number"
              min={variable.obj.meta.min}
              max={variable.obj.meta.max}
              step={variable.obj.meta.step}
              bind:value={variable.obj.value}
            />
            {#if variable.obj.meta.unit}
              <span>{variable.obj.meta.unit}</span>
            {/if}
          </label>
        </div>

        <input
          class="theme-variable__range"
          type="range"
          min={variable.obj.meta.min}
          max={variable.obj.meta.max}
          step={variable.obj.meta.step}
          bind:value={variable.obj.value}
        />
      </div>
    {/each}
  </div>
  <hr>
  <button type="button" onclick={() => theme.reset()}>
    Сбросить настройки темы
  </button>
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

  .active {
    background-color: var(--primary-hover);
    color: var(--primary-text);
  }

  .theme-variable {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .theme-variable__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .theme-variable__value {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .theme-variable__value input {
    width: 4.5rem;
  }

  .theme-variable__range {
    width: 100%;
  }
</style>