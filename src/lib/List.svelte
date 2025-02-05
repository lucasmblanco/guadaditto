<script>
  import { liveQuery } from "dexie";
  import { db } from "../background/background";
  import { YoutubeBrands } from "svelte-awesome-icons";

  let videos = liveQuery(() => db.videos.toArray());
</script>

<ul class="flex flex-col h-50 overflow-y-scroll">
  {#if $videos}
    {#each $videos as video (video.id)}
      <li class="flex items-center gap-2">
        <YoutubeBrands /> <span>{video.title}</span>
      </li>
    {/each}
  {/if}
</ul>

<!-- <div class="flex flex-col h-50 overflow-y-scroll">
  <div class="flex items-center gap-2">Videos1</div>
  <div class="flex items-center gap-2"><YoutubeBrands />Videos1</div>
  <div class="flex items-center gap-2"><YoutubeBrands />Videos1</div>
  <div class="flex items-center gap-2"><YoutubeBrands />Videos1</div>
  <div class="flex items-center gap-2"><YoutubeBrands />Videos1</div>
  <div class="flex items-center gap-2"><YoutubeBrands />Videos1</div>
  <div class="flex items-center gap-2"><YoutubeBrands />Videos1</div>
  <div class="flex items-center gap-2"><YoutubeBrands />Videos1</div>
  <div class="flex items-center gap-2"><YoutubeBrands />Videos1</div>
  <div class="flex items-center gap-2"><YoutubeBrands />Videos1</div>
  <div class="flex items-center gap-2"><YoutubeBrands />Videos1</div>
  <div class="flex items-center gap-2"><YoutubeBrands />Videos1</div>
</div> -->
