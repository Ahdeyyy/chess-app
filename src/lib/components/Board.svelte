<script lang="ts">
	import BoardSquare from './BoardSquare.svelte';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { Chess, type Move } from 'chess.js';
	import { SkipBack, SkipForward, FastForward, Rewind } from 'lucide-svelte';

	const board = writable(new Chess());
	const game_board = writable(new Chess());
	const sizes = {
		sm: 'w-12 h-12',
		lg: 'lg:w-16 lg:h-16'
	};

	const from = writable('');
	const to = writable('');
	const selected_piece = writable('');
	const legal_moves = writable([] as Move[]);
	const turn = writable('w');
	let disabled = false;

	let ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
	let files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

	setContext('chessboard', board);
	setContext('game_board', game_board);
	setContext('from', from);
	setContext('to', to);
	setContext('selected_piece', selected_piece);
	setContext('legal_moves', legal_moves);
	setContext('turn', turn);

	const getSquareColor = (rank: string, file: string) => {
		const isEvenRank = ranks.indexOf(rank) % 2 === 0;
		const isEvenFile = files.indexOf(file) % 2 === 0;
		return isEvenRank === isEvenFile ? 'light' : 'dark';
	};

	$: moves = $game_board.history({ verbose: true });
	$: half_moves = $game_board.history().length;
	$: current_half_move = half_moves;

	let turn_number = 1;

	function increment_turn() {
		let temp = turn_number;
		turn_number++;
		return temp;
	}

	function goto_move(move: number) {
		if (move < 0 || move > moves.length) return;
		current_half_move = move;
		let temp = new Chess(moves[current_half_move - 1].after);
		board.set(temp);

		if (current_half_move !== half_moves) {
			disabled = true;
		} else {
			disabled = false;
			// console.log('not disabled');
		}
	}

	function reset() {
		board.set(new Chess());
		game_board.set(new Chess());
		current_half_move = 0;
		turn_number = 1;
	}

	function go_back() {
		if (current_half_move === 0) return;
		current_half_move--;
		let temp = new Chess(moves[current_half_move - 1].after);
		board.set(temp);
		if (current_half_move !== half_moves) {
			disabled = true;
		} else {
			disabled = false;
			// console.log('not disabled');
		}
	}

	function go_forward() {
		if (current_half_move === half_moves) return;
		current_half_move++;
		let temp = new Chess(moves[current_half_move - 1].after);
		board.set(temp);
		if (current_half_move !== half_moves) {
			disabled = true;
		} else {
			disabled = false;
			// console.log('not disabled');
		}
	}
</script>

<div class="grid grid-cols-2 gap-3">
	<!-- board panel -->
	<div class="col-span-1">
		<section class="grid grid-cols-8">
			{#each ranks as rank}
				{#each files as file}
					<BoardSquare color={getSquareColor(rank, file)} {rank} {file} {sizes} bind:disabled />
				{/each}
			{/each}
		</section>
	</div>

	<!-- moves panel -->
	<div class="col-span-1 px-4 py-1 bg-zinc-800 ml-4 mt-4">
		<p class="text-white font-mono text-center">
			{$turn === 'w' ? 'White to play.' : 'Black to play.'}
		</p>
		<div class="grid rounded-md px-2 py-1">
			<div class="grid grid-cols-4 gap-2  place-content-start text-white mb-4">
				<button class=" cursor-pointer px-4 py-1 rounded-lg" on:click={() => goto_move(1)}>
					<Rewind
						class=" {current_half_move <= 1
							? 'fill-zinc-500 text-zinc-500'
							: 'fill-zinc-200  text-zinc-200'}"
					/>
				</button>
				<button class=" cursor-pointer px-4 py-1 rounded-lg" on:click={go_back}>
					<SkipBack
						class=" {current_half_move <= 1
							? 'fill-zinc-500 text-zinc-500'
							: 'fill-zinc-200  text-zinc-200'}"
					/>
				</button>

				<button class=" cursor-pointer px-4 py-1 rounded-lg" on:click={go_forward}>
					<SkipForward
						class=" {current_half_move >= half_moves
							? 'fill-zinc-500 text-zinc-500'
							: 'fill-zinc-200  text-zinc-200'}"
					/>
				</button>

				<button class=" cursor-pointer px-4 py-1 rounded-lg" on:click={() => goto_move(half_moves)}>
					<FastForward
						class=" {current_half_move >= half_moves
							? 'fill-zinc-500 text-zinc-500'
							: 'fill-zinc-200  text-zinc-200'}"
					/>
				</button>
			</div>

			<div class=" grid grid-cols-9 font-sans ">
				{#each moves as move, i}
					{#if i % 2 === 0}
						<p class="flex col-span-1 px-3 py-1 mr-2">
							<span class="text-gray-400">{increment_turn()}.</span>
						</p>
					{/if}
					<button
						class="text-white text-start px-3 py-1 col-span-4 cursor-pointer {i + 1 ===
						current_half_move
							? 'bg-blue-900 font-semibold'
							: 'hover:bg-sky-600/70'}"
						disabled={i + 1 === current_half_move}
						on:click={() => goto_move(i + 1)}>{move.san}</button
					>
				{/each}
			</div>
		</div>
	</div>
</div>
