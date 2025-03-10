<script lang="ts">
  import { liveQuery } from "dexie";
  import { db } from "../background/background";
  import { YoutubeBrands } from "svelte-awesome-icons";
  import { ExternalLink, Trash2, Youtube } from "lucide-svelte";
  import { flip } from "svelte/animate";
  import { fade, slide } from "svelte/transition";

  let { selectedFolder = $bindable(), checkedDefault = $bindable() } = $props();

  let videos = $derived.by(() => {
    if (selectedFolder.id === null) {
      return liveQuery(async () => {
        const allVideos = await db.videos.toArray();
        return allVideos.filter((video: any) => video.folder_id === null);
      });
    } else {
      return liveQuery(() =>
        db.videos.where("folder_id").equals(selectedFolder.id).toArray()
      );
    }
  });
</script>

<ul
  class="relative flex flex-col h-full overflow-y-auto bg-primary-ditto border-1 border-accent-ditto pt-2 rounded-xl"
  transition:slide
>
  {#if $videos}
    {#each $videos as video (video.id)}
      <li
        class="flex items-center gap-2 text-xs px-2 hover:bg-bg-ditto/50 py-1 rounded-lg"
        animate:flip
      >
        <a
          href={video.url}
          target="_blank"
          class="flex items-center basis-full gap-2 text-xs truncate"
        >
          <Youtube class="basis-auto" size={"20"} />
          <span class="text-left truncate basis-full">{video.title}</span>
        </a>
        <button
          class="flex items-center cursor-pointer rounded p-1"
          onclick={() => db.videos.delete(video.id)}
          ><Trash2 class="basis-auto hover:text-red-500" size={15} /></button
        >
      </li>
    {/each}
  {/if}
  {#if selectedFolder.id}
    <div class="mt-auto"></div>
    <button
      class="text-black w-fit p-2 mt-1 sticky rounded-t-full bg-red-400 -bottom-1 left-1/2 transform -translate-x-1/2 saturate-50 hover:saturate-100"
      onclick={() => {
        checkedDefault = true;
        db.folders.where("id").equals(selectedFolder.id).delete();
        selectedFolder = { id: null, name: "" };
      }}
    >
      <Trash2 size={15} />
    </button>
  {/if}
</ul>
