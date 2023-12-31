<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import Cookies from 'js-cookie';
	import type { Reply } from '../../../models/reply';
	import type { Vote } from '../../../models/vote';
	import { addVote, checkCommentVote, deleteVote, getCommentVotes } from '../../../service/comment';
	import { onMount } from 'svelte';
	import { getToken } from '../../../service/gateway';

	export let data: any;
	export let replyData: Reply;
	export let toggleCommentDropdown: Writable<boolean> = writable(false);
	export let replyUpVotes: Writable<number> = writable(0);
	export let replyDownVotes: Writable<number> = writable(0);
	export let isReplyUpVote: Writable<boolean | Vote> = writable(false);
	export let isReplyDownVote: Writable<boolean | Vote> = writable(false);

	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];

	const formatDate = (date: string) => {
		const inputDate = new Date(date);
		const formattedDate = `${
			months[inputDate.getMonth()]
		} ${inputDate.getDate()}, ${inputDate.getFullYear()} ${inputDate.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		})}`;
		return formattedDate;
	};

	const submitVote = async (voteType: 'UP' | 'DOWN') => {
		const token = Cookies.get('token') as string;
		const commentBaseUrl = data.commentBaseUrl as string;
		if (voteType === 'UP') {
			if ($isReplyUpVote) {
				await deleteVote(commentBaseUrl, token, $isReplyUpVote.id);
				isReplyUpVote.update((bool) => false);
				replyUpVotes.update((i) => i - 1);
			} else {
				if ($isReplyDownVote) {
					await deleteVote(commentBaseUrl, token, $isReplyDownVote.id);
					isReplyDownVote.update((bool) => false);
					replyDownVotes.update((i) => i - 1);
				}
				const vote = (await addVote(commentBaseUrl, token, voteType, null, replyData.id)) as Vote;
				isReplyUpVote.update((val) => vote);
				replyUpVotes.update((i) => i + 1);
			}
		}

		if (voteType === 'DOWN') {
			if ($isReplyDownVote) {
				await deleteVote(commentBaseUrl, token, $isReplyDownVote.id);
				isReplyDownVote.update((bool) => false);
				replyDownVotes.update((i) => i - 1);
			} else {
				if ($isReplyUpVote) {
					await deleteVote(commentBaseUrl, token, $isReplyUpVote.id);
					isReplyUpVote.update((bool) => false);
					replyUpVotes.update((i) => i - 1);
				}
				const vote = (await addVote(commentBaseUrl, token, voteType, null, replyData.id)) as Vote;
				isReplyDownVote.update((val) => vote);
				replyDownVotes.update((i) => i + 1);
			}
		}
	};

	onMount(async () => {
		// Get app token
		const gatewayBaseUrl = data.gatewayBaseUrl as string;
		const signinPayload = {
			email: data.appEmail as string,
			password: data.appPassword as string
		};

		const appToken = await getToken(gatewayBaseUrl, signinPayload.email, signinPayload.password);
		//
		// const token = Cookies.get('token') as string;
		const commentBaseUrl = data.commentBaseUrl as string;

		const upVotes = await getCommentVotes(commentBaseUrl, appToken, 'UP', null, replyData.id);
		const downVotes = await getCommentVotes(commentBaseUrl, appToken, 'DOWN', null, replyData.id);
		replyUpVotes.set(upVotes);
		replyDownVotes.set(downVotes);
		const isUpVotes = await checkCommentVote(commentBaseUrl, appToken, 'UP', null, replyData.id);
		const isDownVotes = await checkCommentVote(
			commentBaseUrl,
			appToken,
			'DOWN',
			null,
			replyData.id
		);
		isReplyUpVote.set(isUpVotes);
		isReplyDownVote.set(isDownVotes);
	});
</script>

<article class="p-6 mb-3 ml-6 lg:ml-12 text-base">
	<footer class="flex justify-between items-center mb-2">
		<div class="flex items-center">
			<p class="inline-flex items-center mr-3 text-sm font-semibold">
				<img
					class="mr-2 w-6 h-6 rounded-full"
					src={replyData.userImage
						? `${data.gatewayBaseUrl}/${replyData.userImage}`
						: '/images/default_avatar.webp'}
					alt="Jese Leos"
				/>{replyData.username}
			</p>
			<p class="text-sm text-gray-600 dark:text-gray-400">
				<time datetime="2022-02-12" title="February 12th, 2022"
					>{formatDate(replyData.createdAt)}</time
				>
			</p>
		</div>
		{#if Cookies.get('user')}
			{#if replyData.userEmail === JSON.parse(Cookies.get('user')).email}
				<button
					id={`dropdownReply${replyData.id}Button`}
					data-dropdown-toggle={`dropdownReply${replyData.id}`}
					class="inline-flex items-center p-2 text-sm font-medium text-center"
					type="button"
					on:click={() => toggleCommentDropdown.set(!$toggleCommentDropdown)}
				>
					<svg
						class="w-4 h-4"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 16 3"
					>
						<path
							d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
						/>
					</svg>
					<span class="sr-only">Comment settings</span>
				</button>
				<!-- Dropdown menu -->
				<div
					id={`dropdownReply${replyData.id}`}
					class:hidden={!$toggleCommentDropdown}
					class:block={$toggleCommentDropdown}
					class="z-10 w-36"
					style="position: absolute; inset: 0px auto auto 0px; margin: 0px;"
				>
					<ul class="py-1 text-sm" aria-labelledby="dropdownMenuIconHorizontalButton">
						<li>
							<a href="#" class="block py-2 px-4 hover:bg-gray-100">Edit</a>
						</li>
						<li>
							<a href="#" class="block py-2 px-4 hover:bg-gray-100">Remove</a>
						</li>
					</ul>
				</div>
			{/if}
		{/if}
	</footer>
	<p class="">
		{replyData.content}
	</p>
	<div class="flex items-center mt-4 space-x-4">
		<button
			type="button"
			class={`flex items-center text-sm  hover:underline  font-medium ${
				$isReplyUpVote ? 'text-cyan-500 ' : 'text-gray-500'
			} `}
			on:click={() => {
				submitVote('UP');
			}}
		>
			<svg
				class="mr-1.5 w-3.5 h-3.5"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
				/>
			</svg>
			{$replyUpVotes}
		</button>

		<button
			type="button"
			class={`flex items-center text-sm  hover:underline  font-medium ${
				$isReplyDownVote ? 'text-cyan-500 ' : 'text-gray-500'
			} `}
			on:click={() => {
				submitVote('DOWN');
			}}
		>
			<svg
				class="mr-1.5 w-3.5 h-3.5"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
				/>
			</svg>
			{$replyDownVotes}
		</button>
	</div>
</article>
