<script lang="ts">
  import { slide } from "svelte/transition";
  import emojiData from "./list.json";
  import { db } from "../background/background";

  let { showEmojiOptions = $bindable() } = $props();

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
  }
</script>

<div class="h-52 relative" transition:slide>
  <div class="grid grid-cols-11 overflow-y-auto items-center h-12">
    {#each Object.keys(emojisCat) as category}
      <button
        onclick={() => setActiveCategory(category)}
        class="rounded hover:bg-pink-400/50 active:bg-pink-400/80 text-lg"
      >
        {emojisCat[category][0].emoji}
      </button>
    {/each}
  </div>
  <div
    class="grid grid-cols-9 overflow-y-auto gap-[0.1rem] h-[calc(100%-3rem)]"
  >
    {#if activeCategory}
      {#each emojisCat[activeCategory] as emoji}
        <button
          onclick={createFolder}
          value={emoji.emoji}
          class="bg-pink-400/50 rounded hover:bg-pink-400/70 active:bg-pink-400/90"
          >{emoji.emoji}</button
        >
      {/each}
    {/if}
  </div>
</div>
