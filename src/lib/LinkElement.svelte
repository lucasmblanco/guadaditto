<script lang="ts">
  import { db } from "../background/background";
  import { Trash2, Youtube, Copy, Check } from "lucide-svelte";

  let isCopied = $state(false);
  let { video } = $props();

  async function copyToClipboard(url) {
    await navigator.clipboard.writeText(url);
    isCopied = true;
    setTimeout(() => {
      isCopied = false;
    }, 2000);
  }

  async function deleteVideo(id) {
    await db.videos.delete(id);
    const videosQnty = await db.videos.count();

    if (videosQnty > 0) {
      chrome.action.setBadgeText({ text: videosQnty.toString() });
    } else {
      chrome.action.setBadgeText({ text: "" });
    }
  }
</script>

<a
  href={video.url}
  target="_blank"
  class="flex basis-full items-center gap-2 truncate text-xs"
>
  <Youtube class="basis-auto" size={"20"} />
  <span class="basis-full truncate text-left">{video.title}</span>
</a>
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
<button
  class="flex items-center rounded p-1"
  onclick={() => deleteVideo(video.id)}
  ><Trash2 class="basis-auto hover:text-red-500" size={15} /></button
>
