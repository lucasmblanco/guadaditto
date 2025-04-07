<script lang="ts">
  import { db } from "../background/background";
  import { Trash2, Youtube, Copy, Check, ListEnd } from "lucide-svelte";
  import { updateNotificationBadge } from "../utils/utils";

  let isCopied = $state(false);
  let { video } = $props();

  async function markHasView(id) {
    const videoData = await db.videos.get(id);
    if (videoData) {
      await db.videos.update(id, {
        has_been_viewed: true,
      });
    }
  }

  async function handleClick() {
    await markHasView(video.id);

    await updateNotificationBadge(db);

    window.open(video.url, "_blank");
  }

  async function copyToClipboard(url) {
    await navigator.clipboard.writeText(url);
    isCopied = true;
    setTimeout(() => {
      isCopied = false;
    }, 2000);
  }

  async function deleteVideo(id) {
    await db.videos.delete(id);

    await updateNotificationBadge(db);
  }
</script>

<!-- <a
  href={video.url}
  target="_blank"
  class="flex basis-full items-center gap-2 truncate text-xs"
>
  <Youtube class="basis-auto" size={"20"} />
  <span class="basis-full truncate text-left">{video.title}</span>
</a> -->
<button
  onclick={handleClick}
  class="flex basis-full cursor-pointer items-center gap-2 truncate text-xs"
>
  <Youtube class="basis-auto" size={"20"} />
  <span
    class="basis-full truncate text-left {video.has_been_viewed
      ? 'opacity-50'
      : ''}">{video.title}</span
  >
</button>
<button
  class="flex items-center rounded p-1"
  onclick={() => copyToClipboard(video.url)}
>
  {#if isCopied}
    <Check class="basis-auto text-green-500" size={15} />
  {:else}
    <Copy class="basis-auto hover:text-yellow-500" size={15} />
  {/if}
</button>
{#if video.playlist_url}
  <a
    href={video.playlist_url}
    target="_blank"
    class="flex items-center rounded p-1"
  >
    <ListEnd class="basis-auto hover:text-emerald-500" size={15} />
  </a>
{/if}
<button
  class="flex items-center rounded p-1"
  onclick={() => deleteVideo(video.id)}
  ><Trash2 class="basis-auto hover:text-red-500" size={15} /></button
>
