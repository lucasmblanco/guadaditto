<script lang="ts">
  import svelteLogo from "./assets/svelte.svg";
  import viteLogo from "/vite.svg";
  import Counter from "./lib/Counter.svelte";
  import { FolderInput } from "lucide-svelte";
</script>

<main class="bg-pink-300 p-2">
  <h1>guardaditto</h1>
  <div class="flex">
    <input
      type="text"
      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
    />
    <div class="flex space-x-2">
      <button class="bg-red-300 text-primary-foreground hover:bg-blue-300/90"
        ><FolderInput /></button
      >
      <button class="bg-red-300 text-primary-foreground hover:bg-blue-300/90"
        >add</button
      >
    </div>
  </div>
</main>
