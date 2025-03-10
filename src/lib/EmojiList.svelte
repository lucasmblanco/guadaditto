<script lang="ts">
  import { slide } from "svelte/transition";
  import emojiData from "./list.json";
  import { db } from "../background/background";

  let { showEmojiOptions = $bindable(), resize = $bindable() } = $props();

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
    resize = true;
  }
</script>

<div class="h-full relative" transition:slide>
  <div class="grid grid-cols-11 overflow-y-auto items-center w-full h-12 gap-2">
    {#each Object.keys(emojisCat) as category}
      <button
        onclick={() => setActiveCategory(category)}
        class="h-10 w-10 inline-flex items-center {category === activeCategory
          ? 'bg-primary-ditto'
          : ''} justify-center gap-2 whitespace-nowrap rounded-full text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 // hover:bg-primary-ditto"
      >
        {emojisCat[category][0].emoji}
      </button>
    {/each}
  </div>
  <div class="relative overflow-y-auto h-[calc(100%-3rem)]">
    <div transition:slide class="relative grid grid-cols-10 gap-[.1rem]">
      // fix animation
      {#if activeCategory}
        {#each emojisCat[activeCategory] as emoji}
          <button
            onclick={createFolder}
            value={emoji.emoji}
            class=" rounded-full hover:bg-primary-ditto/50 active:bg-primary-ditto/150 w-full h-8 self-center text-center"
            >{emoji.emoji}</button
          >
        {/each}
      {/if}
    </div>
  </div>
</div>
