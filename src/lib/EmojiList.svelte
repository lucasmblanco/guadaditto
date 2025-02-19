<script lang="ts">
  import { slide } from "svelte/transition";
  import emojiData from "./list.json";
  import { db } from "../background/background";

  let { showEmojiOptions = $bindable(), handleScroll } = $props();

  let emojisCat = {};
  let activeCategory = $state("Smileys & Emotion");

  emojiData["emojis"].forEach((emoji) => {
    if (emoji.category === "Component") return;
    if (!emojisCat[emoji.category]) {
      emojisCat[emoji.category] = [];
    }
    emojisCat[emoji.category].push(emoji);
  });

  function setActiveCategory(category) {
    activeCategory = category;
  }
  async function createFolder(e) {
    showEmojiOptions = false;
    await db.folders.add({
      name: e.target.value,
      created_at: new Date(),
    });
    handleScroll();
  }
</script>

<div class="h-52 relative" transition:slide>
  <div class="grid grid-cols-11 overflow-y-auto items-center w-full h-12">
    {#each Object.keys(emojisCat) as category}
      <button
        onclick={() => setActiveCategory(category)}
        class="h-10 w-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 // hover:bg-ditto-secondary active:bg-ditto-tertiary active:text-white has-[:checked]:bg-ditto-secondary"
      >
        {emojisCat[category][0].emoji}
      </button>
    {/each}
  </div>
  <div class="grid grid-cols-9 overflow-y-auto h-[calc(100%-3rem)] gap-[.1rem]">
    {#if activeCategory}
      {#each emojisCat[activeCategory] as emoji}
        <button
          onclick={createFolder}
          value={emoji.emoji}
          class="bg-ditto-secondary rounded hover:bg-ditto-secondary/50 active:bg-ditto-tertiary w-full h-8 self-center text-center"
          >{emoji.emoji}</button
        >
      {/each}
    {/if}
  </div>
</div>
