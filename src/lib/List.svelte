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
        db.videos.where("folder_id").equals(selectedFolder.id).toArray(),
      );
    }
  });
</script>

<ul
  class="bg-primary-ditto border-accent-ditto relative flex h-full flex-col overflow-y-auto rounded-xl border-1 pt-2"
  transition:slide
>
  {#if $videos}
    {#each $videos as video (video.id)}
      <li
        class="hover:bg-bg-ditto/50 flex items-center gap-2 rounded-lg px-2 py-1 text-xs"
        animate:flip
      >
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
          onclick={() => db.videos.delete(video.id)}
          ><Trash2 class="basis-auto hover:text-red-500" size={15} /></button
        >
      </li>
    {/each}
  {/if}
  {#if selectedFolder.id}
    <div class="mt-auto"></div>
    <button
      class="sticky -bottom-1 left-1/2 mt-1 w-fit -translate-x-1/2 transform rounded-t-full bg-red-400 p-2 text-black saturate-50 hover:saturate-100"
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
