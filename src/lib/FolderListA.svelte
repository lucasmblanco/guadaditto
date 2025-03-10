<script lang="ts">
  import { liveQuery } from "dexie";
  import { ChevronLeft, ChevronRight } from "lucide-svelte";
  import { db } from "../background/background";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  let scrollContainer = $state<HTMLElement | null>(null);
  let showLeftGradient = $state(false);
  let showRightGradient = $state(false);
  let { selectFolder, resize = $bindable() } = $props();

  let folders = liveQuery(() => db.folders.toArray());

  function handleScroll() {
    if (scrollContainer !== null) {
      requestAnimationFrame(() => {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
        showLeftGradient = Math.ceil(scrollLeft) > 0;
        showRightGradient =
          Math.ceil(scrollLeft) < scrollWidth - clientWidth - 1;
      });
    }
  }

  function scroll(direction: "left" | "right") {
    if (scrollContainer) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }
  $effect(() => {
    if (resize) {
      handleScroll();
      resize = false;
    }
  });

  onMount(() => {
    handleScroll();
    const resizeObserver = new ResizeObserver(handleScroll);
    if (scrollContainer) {
      resizeObserver.observe(scrollContainer);
    }

    return () => {
      resizeObserver.disconnect();
    };
  });
  $effect(() => {
    if (resize) {
      // scrollContainer.scrollTo({
      //   left: scrollContainer.scrollWidth,
      //   behavior: "smooth",
      // });
      handleScroll();

      resize = false;
    }
  });
</script>

<div
  class="relative grid grid-flow-col gap-2 items-center min-w-0 py-2 text-sm justify-between"
  transition:slide
>
  {#if showLeftGradient}
    <button
      onclick={() => scroll("left")}
      class=" bg-white rounded-full"
      aria-label="Scroll left"
    >
      <ChevronLeft size={15} />
    </button>
  {/if}

  <div
    class="grid grid-flow-col items-center overflow-x-auto min-w-0 scrollbar-hide select-none gap-2"
    bind:this={scrollContainer}
    onscroll={handleScroll}
  >
    {#if $folders && $folders.length > 0}
      {#each $folders as folder (folder.id)}
        <label
          class="h-10 w-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 // hover:bg-primary-ditto active:bg-primary-ditto/150"
          for={folder.name}
          ><input
            onclick={() => selectFolder(folder)}
            hidden
            type="radio"
            name="folder"
            id={folder.name}
            value={folder.name}
          />{folder.name}</label
        >
      {/each}
    {:else}
      <div
        class="grid grid-flow-col gap-2 items-center min-w-0 py-2 text-sm justify-between"
      >
        No folders
      </div>
    {/if}
  </div>
  {#if showRightGradient}
    <button
      onclick={() => scroll("right")}
      class=" bg-white rounded-full"
      aria-label="Scroll right"
    >
      <ChevronRight size={15} />
    </button>
  {/if}
</div>

<style>
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
