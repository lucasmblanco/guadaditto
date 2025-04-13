<script lang="ts">
  import { Info } from "lucide-svelte";
</script>

<div class=" z-0 rounded-full border border-red-500 bg-red-800 text-white">
  <span
    class="flex w-full items-center justify-center gap-2 p-2 text-xs font-semibold"
  >
    <Info size={15} />
    {chrome.i18n.getMessage("video_exists")}
  </span>
</div>
