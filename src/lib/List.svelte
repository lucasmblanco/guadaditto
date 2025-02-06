<script>
  import { liveQuery } from "dexie";
  import { db } from "../background/background";
  import { YoutubeBrands } from "svelte-awesome-icons";
  import { ExternalLink, Trash2 } from "lucide-svelte";

  let videos = liveQuery(() => db.videos.toArray());

  // let arr = $state(Array(5).fill(null));
  // function addRow() {
  //   arr.push(null);
  // }
</script>

<ul class="flex flex-col h-50 overflow-y-auto pe-3">
  {#if $videos}
    {#each $videos as video (video.id)}
      <li class="flex items-center gap-2 text-xs">
        <YoutubeBrands class="basis-auto" />
        <span class="text-left truncate basis-full">{video.title}</span>
        <a href={video.url} target="_blank">
          <ExternalLink class="basis-auto" size={15} /></a
        >
        <button
          class="cursor-pointer"
          onclick={() => db.videos.delete(video.id)}
          ><Trash2 class="basis-auto" size={15} /></button
        >
      </li>
    {/each}
  {/if}
</ul>

<!-- <ul class="flex flex-col h-50 overflow-y-auto pe-3">
  {#each arr as _, i}
    <li class="flex items-center gap-2 text-xs">
      <YoutubeBrands class="basis-auto" />
      <span class="text-left truncate basis-full">Video Title</span>
      <a href={""} target="_blank">
        <ExternalLink class="basis-auto" size={15} /></a
      >
      <button class="cursor-pointer"
        ><Trash2 class="basis-auto" size={15} /></button
      >
    </li>
  {/each}
</ul> -->
