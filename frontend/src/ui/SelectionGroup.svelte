<script lang="ts" generics="T extends Record<string, unknown>">
	import type { Snippet } from 'svelte';

	type Props = {
		items: T[];
		itemKey: keyof T;
		active: T[keyof T] | T[keyof T][];
		item: Snippet<[T, boolean]>;
	};

	let { 
    items,
    itemKey,
    active,
    item
  }: Props = $props();

	const isMultiple = $derived(Array.isArray(active));

	function getKey(item: T) { return item[itemKey]; }

	function isSelected(item: T) {
		const key = getKey(item);
		return isMultiple
			? (active as T[keyof T][]).includes(key)
			: active === key;
	}
</script>

{#each items as itemData (getKey(itemData))}
	{@render item(itemData, isSelected(itemData))}
{/each}
