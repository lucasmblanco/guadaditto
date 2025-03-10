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

<div class="relative h-full" transition:slide>
  <div class="grid h-12 w-full grid-cols-11 items-center gap-2 overflow-y-auto">
    {#each Object.keys(emojisCat) as category}
      <button
        onclick={() => setActiveCategory(category)}
        class="inline-flex h-10 w-10 items-center {category === activeCategory
          ? 'bg-primary-ditto'
          : ''} ring-offset-background focus-visible:ring-ring // hover:bg-primary-ditto justify-center gap-2 rounded-full text-lg font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
      >
        {emojisCat[category][0].emoji}
      </button>
    {/each}
  </div>
  <div class="relative h-[calc(100%-3rem)] overflow-y-auto">
    <div transition:slide class="relative grid grid-cols-10 gap-[.1rem]">
      {#if activeCategory}
        {#each emojisCat[activeCategory] as emoji}
          <button
            onclick={createFolder}
            value={emoji.emoji}
            class=" hover:bg-primary-ditto/50 active:bg-primary-ditto/150 h-8 w-full self-center rounded-full text-center"
            >{emoji.emoji}</button
          >
        {/each}
      {/if}
    </div>
  </div>
</div>
