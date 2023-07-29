<script lang="ts">
	import { appWindow } from '@tauri-apps/api/window';
	import { X, Minus, Maximize2, Minimize2 } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const maximized = writable(false); //TODO: use user default

	onMount(() => {
		document
			.getElementById('titlebar-minimize')
			?.addEventListener('click', () => appWindow.minimize());
		document.getElementById('titlebar-maximize')?.addEventListener('click', () => {
			appWindow.toggleMaximize();
			maximized.set(!$maximized);
		});
		document.getElementById('titlebar-close')?.addEventListener('click', () => appWindow.close());
	});
</script>

<div data-tauri-drag-region class="flex flex-row justify-end text-white">
	<div class="titlebar-button hover:bg-zinc-800 px-2 py-1" id="titlebar-minimize">
		<Minus class="w-4 h-3" />
	</div>
	<div class="titlebar-button hover:bg-zinc-800 px-2 py-1" id="titlebar-maximize">
		{#if $maximized}
			<Minimize2 class="w-4 h-3" />
		{:else}
			<Maximize2 class="w-4 h-3" />
		{/if}
	</div>
	<div class="titlebar-button hover:bg-red-800 px-2 py-1" id="titlebar-close">
		<X class="w-4 h-3" />
	</div>
</div>
