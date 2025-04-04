<script lang="ts">
  import LinkElement from "./LinkElement.svelte";
  import { liveQuery } from "dexie";
  import { db } from "../background/background";
  import { HeartCrack, Trash2, Youtube } from "lucide-svelte";
  import { flip } from "svelte/animate";
  import { slide } from "svelte/transition";
  import type { SelectedFolder } from "../types";
  import { t } from "../i8n/i8n.svelte";

  let {
    selectedFolder = $bindable(),
    checkedDefault = $bindable(),
  }: {
    selectedFolder: SelectedFolder;
    checkedDefault?: boolean;
  } = $props();

  let videos = $derived.by(() => {
    if (selectedFolder.id === null) {
      return liveQuery(async () => {
        const allVideos = await db.videos.toArray();
        return allVideos.filter((video: any) => video.folder_id === null);
      });
    } else {
      return liveQuery(() =>
        db.videos.where("folder_id").equals(selectedFolder.id!).toArray(),
      );
    }
  });
</script>

<ul
  class="bg-primary-ditto border-accent-ditto relative flex h-full flex-col overflow-y-auto rounded-xl border-1 pt-2"
  transition:slide
>
  {#if $videos && $videos.length > 0}
    {#each $videos as video (video.id)}
      <li
        class="hover:bg-bg-ditto/50 flex items-center gap-2 rounded-lg px-2 py-1 text-xs"
        animate:flip
      >
        <LinkElement {video} />
      </li>
    {/each}
  {:else}
    <div class="grid h-full min-w-0 grid-flow-col place-items-center">
      <div class="grid min-w-0 grid-flow-row place-items-center opacity-50">
        <HeartCrack
          class="text-accent-ditto"
          strokeWidth={2}
          absoluteStrokeWidth={true}
        />
        <p class="text-accent-ditto font-main text-base italic">
          {t("homepage.empty")}
        </p>
      </div>
    </div>
  {/if}
  {#if selectedFolder.id}
    <div class="mt-auto"></div>
    <button
      title={t("button.delete_folder")}
      class="sticky -bottom-1 left-1/2 mt-1 w-fit -translate-x-1/2 transform rounded-t-full bg-red-400 p-2 text-black saturate-50 hover:saturate-100"
      onclick={() => {
        checkedDefault = true;
        db.folders.where("id").equals(selectedFolder.id!).delete();
        // selectFolder(null, selectedFolder, true);
        selectedFolder.id = null;
        selectedFolder.name = "";
      }}
    >
      <Trash2 size={15} />
    </button>
  {/if}
</ul>
