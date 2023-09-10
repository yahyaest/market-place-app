<script lang="ts">
	import { getCurrentUserAvatar } from '../service/gateway';

	export let data;

 let userImage : string | null | undefined = null

	const getUserAvatar = async () => {
		if (data.user) {
			 userImage = await getCurrentUserAvatar(data.gatewayBaseUrl as string);
		}
	};
 getUserAvatar()
</script>

<h1>Welcome {data.user ? data.user.username : 'user'}</h1>
{#if userImage}
<img src={userImage} alt={userImage} style="width: 50px; height: 50px; border-radius: 50%;">
{/if}
