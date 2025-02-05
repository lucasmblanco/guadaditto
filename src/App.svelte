<script lang="ts">
  import { FolderInput, BadgePlus, ListVideo } from "lucide-svelte";
  import { db } from "./background/background";
  import List from "./lib/List.svelte";

  const handleSubmit = async (e) => {
    const formData = new FormData(e.target);
    const title = formData.get("url") as string;
    try {
      await db.videos.add({
        title: title,
        folder_id: 1,
        url: "https://www.youtube.com/watch?v=1",
        created_at: new Date(),
      });
    } catch (error) {
      console.error("Error adding video", error);
    }
  };
</script>

<main class="bg-pink-300 p-2 text-black w-[400px]">
  <h1>guardaditto</h1>
  <form class="flex gap-2" on:submit|preventDefault={handleSubmit}>
    <input
      name="url"
      type="text"
      class="flex h-6 w-full rounded-sm border border-black border-input bg-background px-2 py-2 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
    />
    <div class="flex gap-2">
      <button
        class="border border-black h-6 border-input bg-background rounded-sm px-3 cursor-pointer hover:bg-accent hover:text-accent-foreground"
        ><FolderInput class="text-black " size={15} /></button
      >
      <button
        type="submit"
        class="border border-black h-6 border-input bg-background rounded-sm px-3 cursor-pointer hover:bg-accent hover:text-accent-foreground"
        ><BadgePlus class="text-black " size={15} /></button
      >
    </div>
  </form>
  <!-- <div>No folders</div> -->
  <div class="flex gap-2 p-2 items-center text-sm">
    <div><ListVideo size={20} /></div>
    <div class="h-4 bg-black w-[1px]"></div>
    <div>😍</div>
    <div>🔥</div>
    <div>👀</div>
  </div>
  <hr />
  <List />
</main>
