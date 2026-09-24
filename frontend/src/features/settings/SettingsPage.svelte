<script lang="ts">
  import { settings } from "$shared/services";
</script>

<div>
  {#each settings.pages as page}
    {@const PageComponent = page.component}
    <section class="{page.title}-settings">
      <p>{page.title}</p>
      <div>
        <PageComponent />
      </div>
    </section>
  {/each}
</div>