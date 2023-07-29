<script lang="ts">
	import { getPieceImage, getSquare } from '$lib/utils/helpers';
	import type { Chess, Color, PieceSymbol, Square, Move } from 'chess.js';
	import { Circle } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	export let color: 'light' | 'dark';
	export let rank: string;
	export let file: string;
	export let sizes: { [key: string]: string };
	export let disabled: boolean;

	// const background: string = color === 'light' ? '#eeeed2' : '#769656';
	const background: string = color === 'light' ? 'hsl(37, 66%, 83%)' : 'hsl(27, 36%, 55%)';
	const text_color: string = color === 'dark' ? 'text-[#f0d9b5]' : 'text-[#b58863]';
	let highlight: boolean = false;
	let can_click: boolean = false;
	let is_move: boolean = false;

	const game_board: Writable<Chess> = getContext('game_board');
	const board: Writable<Chess> = getContext('chessboard');
	const from: Writable<string> = getContext('from');
	const to: Writable<string> = getContext('to');
	const selected_piece: Writable<string> = getContext('selected_piece');
	const legal_moves: Writable<Move[]> = getContext('legal_moves');
	const turn: Writable<string> = getContext('turn');

	let piece: PieceSymbol = $board.get(getSquare(rank, file)).type;
	let square: Square = getSquare(rank, file);
	let piece_color = $board.get(square).color;

	function handleClick() {
		if ($from === '') {
			from.set(square as string);
			selected_piece.set(piece as string);
			const moves = $board.moves({
				square: $from as Square,
				piece: $selected_piece as PieceSymbol,
				verbose: true
			});
			legal_moves.set(moves);
			return;
		}

		if ($from === square) {
			from.set('');
			selected_piece.set('');
			legal_moves.set([]);
			return;
		}

		if ($legal_moves.find((move) => move.to === square) === undefined) {
			from.set(square as string);
			selected_piece.set(piece as string);
			const moves = $board.moves({
				square: $from as Square,
				piece: $selected_piece as PieceSymbol,
				verbose: true
			});
			legal_moves.set(moves);

			return;
		}

		if ($legal_moves.find((move) => move.to === square) !== undefined) {
			to.set(square as string);
			// console.log($board.ascii());
			$board.move({
				from: $from as Square,
				to: $to as Square
			});
			$game_board.move({
				from: $from as Square,
				to: $to as Square
			});
			game_board.set($game_board);
			board.set($board);
			// console.log($board.ascii());


			turn.set($turn === 'w' ? 'b' : 'w');
			from.set('');
			to.set('');
			selected_piece.set('');
			legal_moves.set([]);
			return;
		}
	}

	let piece_image = getPieceImage(piece, piece_color);

	$: {
		piece_color = $board.get(square).color;
		piece = $board.get(square).type;
		is_move = $legal_moves.find((move) => move.to === square) !== undefined;
		highlight = $from === square;
		can_click =
			piece !== undefined || $legal_moves.find((move) => move.to === square) !== undefined;
		piece_image = getPieceImage(piece, piece_color);
	}
</script>

<button
	style="--square-color: {background}; "
	on:click={handleClick}
	disabled={!can_click || disabled}
	class:selected={highlight}
	class="{sizes['sm']} {sizes['lg']} relative grid"
>
	{#if file === 'a'}
		<p
			class="absolute top-0 left-0 {text_color} text-sm lg:text-base font-semibold align-middle font-sans"
		>
			{rank}
		</p>
	{/if}

	{#if rank === '1'}
		<p
			class="absolute left-0 bottom-0 {text_color} text-sm lg:text-base font-semibold align-middle font-sans"
		>
			{file}
		</p>
	{/if}
	{#if piece !== undefined}
		<div class="place-self-center" >
			{#if is_move}
				<Circle
				
				strokeWidth={1.5}
					class="absolute aspect-square top-0 left-0 translate-y-1 -translate-x-[0.15rem] lg:-translate-x-1 opacity-70 w-[45px] h-[45px] lg:w-[80px] lg:h-[80px]  text-green-900 "
				/>
			{/if}

			<img class="aspect-square w-10 lg:w-[4.5rem] -translate-x-1" src={piece_image} alt="piece" />
		</div>
	{/if}

	{#if is_move && piece === undefined}
		<Circle class="fill-green-900 text-green-900 place-self-center -translate-x-1 w-4 h-4 lg:w-7 lg:h-7" />
	{/if}
</button>

<style>
	button {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--square-color);
		border: none;
		cursor: pointer;
	}

	button:disabled {
		cursor: default;
	}

	.selected {
		background-color: #baca44;
	}

	.legalmove {
		background-color: rgb(105, 209, 0);
	}

</style>
