<script lang="ts">
  import LinkElement from "./LinkElement.svelte";
  import { liveQuery } from "dexie";
  import { db } from "../background/background";
  import { HeartCrack, Trash2, Youtube } from "lucide-svelte";
  import { flip } from "svelte/animate";
  import { slide } from "svelte/transition";
  import type { SelectedFolder } from "../types";
  import { updateNotificationBadge } from "../utils/utils";

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

<div class="relative h-full w-full">
  <ul
    class="bg-primary-ditto border-accent-ditto flex h-full flex-col overflow-y-auto rounded-l-xl border-1 pt-2"
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
          <p
            class="text-accent-ditto font-primary text-base italic select-none"
          >
            {chrome.i18n.getMessage("homepage_empty")}
          </p>
        </div>
      </div>
    {/if}
    {#if selectedFolder.id}
      <div class="absolute bottom-1 left-1/2 z-20 -translate-x-1/2">
        <button
          title={chrome.i18n.getMessage("button_delete_folder")}
          class=" right-4 bottom-4 z-10 mb-2 flex w-fit items-center justify-center rounded-full bg-red-500 p-2 text-black saturate-50 hover:saturate-100"
          onclick={async () => {
            try {
              await db.transaction("rw", db.folders, db.videos, async () => {
                await db.folders.delete(selectedFolder.id!);
              });
              await updateNotificationBadge(db);
              checkedDefault = true;
              selectedFolder.id = null;
              selectedFolder.name = "";
            } catch (error) {
              console.error("Error deleting folder", error);
            }
          }}
        >
          <Trash2 size={15} />
        </button>
      </div>
    {/if}
  </ul>
</div>
