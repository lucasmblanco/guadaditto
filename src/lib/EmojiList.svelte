<script lang="ts">
  import { slide } from "svelte/transition";
  import emojiData from "../data/emojiList.json";
  import { db } from "../background/background";

  let { showEmojiOptions = $bindable(), resize = $bindable() } = $props();

  let emojisCat: { [key: string]: Array<{ emoji: string; category: string }> } =
    {};
  let activeCategory = $state("Smileys & Emotion");

  emojiData["emojis"].forEach((emoji) => {
    if (emoji.category === "Component") return;
    if (!emojisCat[emoji.category]) {
      emojisCat[emoji.category] = [];
    }
    emojisCat[emoji.category].push(emoji);
  });

  function setActiveCategory(category: string) {
    activeCategory = category;
  }
  async function createFolder(e: Event) {
    const name = (e.target as HTMLButtonElement).value;
    showEmojiOptions = false;
    await db.folders.add({
      name,
      created_at: new Date(),
    });
    resize = true;
  }
</script>

<div class="absolute top-0 left-0 h-full" transition:slide>
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
  <div
    class="border-accent-ditto bg-primary-ditto relative h-[calc(100%-3rem)] overflow-y-auto rounded-xl border-1"
  >
    <div class=" relative grid grid-cols-10 gap-[.1rem]">
      {#if activeCategory}
        {#each emojisCat[activeCategory] as emoji}
          <button
            onclick={createFolder}
            value={emoji.emoji}
            class=" font-emoji hover: h-8 w-full self-center rounded-full text-center hover:backdrop-saturate-200"
            >{emoji.emoji}</button
          >
        {/each}
      {/if}
    </div>
  </div>
</div>
