<script lang="ts">
  import FolderList from "./lib/FolderList.svelte";
  import FolderListAlt from "./lib/FolderListAlt.svelte";
  import {
    FolderInput,
    BadgePlus,
    Settings,
    ChevronLeft,
    Info,
  } from "lucide-svelte";
  import { db } from "./background/background";
  import List from "./lib/List.svelte";
  import EmojiList from "./lib/EmojiList.svelte";
  import { onMount } from "svelte";
  import {
    isYoutubeVideoUrl,
    extractVideoTitle,
    updateNotificationBadge,
    cleanYoutubeUrl,
    isInPlaylist,
    getYoutubePlaylistLink,
  } from "./utils/utils";
  import SettingsPage from "./lib/SettingsPage.svelte";
  import type { SelectedFolder } from "./types";
  import { Toaster, toast } from "svelte-sonner";
  import CustomToast from "./lib/CustomToast.svelte";

  let showExistingFolders = $state(false);
  let showEmojiOptions = $state(false);
  let url = $state("");
  let title = $state("");
  let playlist_url = $state<string | null>(null);
  let selectedFolder: SelectedFolder = $state({
    id: null,
    name: "",
  });
  let resize = $state(false);
  let checkedDefault = $state(true);
  let enableSubmit = $state(false);
  let openSettings = $state(false);

  const fetchTabData = async () => {
    chrome.storage.local.get(["videoUrl", "videoTitle"], async (data) => {
      if (data.videoUrl && data.videoTitle) {
        url = data.videoUrl;
        title = data.videoTitle;
        chrome.storage.local.remove(["videoUrl", "videoTitle"]);
        enableSubmit = true;
      } else {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (tab?.url && isYoutubeVideoUrl(tab?.url)) {
          enableSubmit = true;
          url = cleanYoutubeUrl(tab.url);
          title = extractVideoTitle(tab.title as string) || "";
          playlist_url = isInPlaylist(tab.url)
            ? getYoutubePlaylistLink(tab.url)
            : null;
        }
      }
    });
  };

  onMount(async () => {
    fetchTabData();
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      await db.transaction("rw", db.videos, async () => {
        await db.videos.add({
          title,
          folder_id: selectedFolder ? selectedFolder.id : null,
          url,
          created_at: new Date(),
          playlist_url,
          has_been_viewed: false,
        });
      });

      const listVideoElements = document.querySelectorAll("ul>li");
      const lastElement = listVideoElements[listVideoElements.length - 1];
      lastElement.scrollIntoView({ behavior: "smooth" });

      await updateNotificationBadge(db);
      enableSubmit = false;
      title = getAddedMessage();
    } catch (error) {
      if (error instanceof Error && error.name === "ConstraintError") {
        toast.custom(CustomToast as any);
        return;
      } else {
        console.error("Error adding video", error);
      }
    }
  };

  function getAddedMessage() {
    const message = chrome.i18n.getMessage("input_added");
    return message;
  }
</script>

<header
  class="p flex {openSettings
    ? 'justify-start'
    : 'justify-end'} z-100 px-2 pt-2"
>
  {#if openSettings}
    <button
      class="hover:bg-accent-ditto rounded-full p-2 opacity-50 transition-all hover:opacity-100"
      title={chrome.i18n.getMessage("button_back")}
      onclick={() => (openSettings = !openSettings)}
      ><ChevronLeft class="saturate-25 hover:saturate-100" size={16} /></button
    >{:else}
    <button
      class="hover:bg-accent-ditto rounded-full p-2 opacity-50 transition-all hover:opacity-100"
      title={chrome.i18n.getMessage("button_settings")}
      onclick={() => (openSettings = !openSettings)}
      ><Settings class="saturate-25 hover:saturate-100 " size={16} /></button
    >
  {/if}
</header>
<main class="z-50 p-3 pt-0 transition-all">
  <div class="flex flex-col items-center justify-center text-center">
    <img
      src="/g-logo.svg"
      alt=""
      class="text-accent-ditto w-5 pb-4 opacity-50 select-none"
    />
  </div>
  {#if !openSettings}
    <form
      class="flex items-center justify-between gap-2"
      onsubmit={handleSubmit}
    >
      <input
        bind:value={title}
        readonly
        disabled
        name="url"
        type="text"
        placeholder={chrome.i18n.getMessage("input_placeholder")}
        class="border-accent-ditto bg-primary-ditto ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring text-xxs col-span-4 flex h-8 w-full rounded-full border px-2 py-2 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div class="flex gap-2">
        <button
          title={chrome.i18n.getMessage("button_assign_folder")}
          disabled={!enableSubmit}
          type="button"
          onclick={() => {
            showExistingFolders = !showExistingFolders;
          }}
          class="font-emoji inline-flex h-8 w-8 items-center justify-center border {showExistingFolders
            ? 'bg-primary-ditto'
            : ''} border-accent-ditto ring-offset-background focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground hover:bg-primary-ditto active:bg-primary-ditto/150 cursor-pointer gap-2 rounded-full text-center text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        >
          {#if selectedFolder && selectedFolder.id}
            {selectedFolder.name}
          {:else}
            <FolderInput class="text-xs" />
          {/if}
        </button>
        <button
          title={chrome.i18n.getMessage("button_add_video")}
          disabled={!enableSubmit}
          type="submit"
          class="border-accent-ditto ring-offset-background focus-visible:ring-ring not-first:hover:bg-accent hover:text-accent-foreground hover:bg-primary-ditto active:bg-primary-ditto/150 inline-flex h-8 w-8 cursor-pointer items-center justify-center gap-2 rounded-full border text-center text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
          ><BadgePlus class="text-xs" /></button
        >
      </div>
    </form>
    <div class="relative h-14">
      {#if showExistingFolders}
        <FolderListAlt {selectedFolder} bind:showExistingFolders bind:resize />
      {:else}
        <FolderList
          {selectedFolder}
          bind:showEmojiOptions
          bind:resize
          bind:showExistingFolders
        />
      {/if}
    </div>
    <div class="relative h-50">
      {#if !showEmojiOptions}
        <List bind:selectedFolder bind:checkedDefault />
      {:else}
        <EmojiList bind:showEmojiOptions bind:resize />
      {/if}
    </div>
  {:else}
    <SettingsPage />
  {/if}
</main>
<Toaster
  position="top-center"
  toastOptions={{
    unstyled: true,
    classes: {
      toast: "pointer-events-none",
    },
  }}
/>
