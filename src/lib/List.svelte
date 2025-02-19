<script lang="ts">
  import { liveQuery } from "dexie";
  import { db } from "../background/background";
  import { YoutubeBrands } from "svelte-awesome-icons";
  import { ExternalLink, Trash2 } from "lucide-svelte";
  import { flip } from "svelte/animate";
  import { fade, slide } from "svelte/transition";

  let { selectedFolderId } = $props();

  let videos = $derived.by(() => {
    if (selectedFolderId === null) {
      return liveQuery(async () => {
        const allVideos = await db.videos.toArray();
        return allVideos.filter((video: any) => video.folder_id === null);
      });
    } else {
      return liveQuery(() =>
        db.videos.where("folder_id").equals(selectedFolderId).toArray()
      );
    }
  });
</script>

<ul
  class="flex flex-col h-50 overflow-y-auto px-3 rounded-md py-2 bg-ditto-secondary border-1 border-ditto-less-bright"
  transition:slide
>
  {#if $videos}
    {#each $videos as video (video.id)}
      <li
        class="flex items-center gap-2 text-xs hover:bg-ditto-secondary"
        animate:flip
      >
        <a
          href={video.url}
          target="_blank"
          class="flex items-center basis-full gap-2 text-xs truncate"
        >
          <YoutubeBrands class="basis-auto" size={"20"} />
          <span class="text-left truncate basis-full">{video.title}</span>
        </a>
        <button
          class="cursor-pointer"
          onclick={() => db.videos.delete(video.id)}
          ><Trash2 class="basis-auto" size={15} /></button
        >
      </li>
    {/each}
  {/if}
</ul>
