<script lang="ts">
  import { db } from "../background/background";
  import { exportDB, importInto } from "dexie-export-import";
  import { VERSION } from "../version";
  import { updateNotificationBadge } from "../utils/utils";

  const options = {
    acceptVersionDiff: true, // Ignore version differences between databases
    overwriteValues: true, // Overwrite existing values in the database
    clearTablesBeforeImport: false, // Do not clear tables before importing
  };

  async function handleImport(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      const blobFile = new Blob([file], { type: "application/json" });
      await importInto(db, blobFile, options);

      await updateNotificationBadge(db);
    } catch {
      console.log("Error importing database");
    }
  }

  function downloadData(blob: Blob, name: string) {
    let a = document.createElement("a");
    document.body.append(a);
    a.download = name;
    a.href = URL.createObjectURL(blob);
    a.click();
    a.remove();
  }

  async function handleExport() {
    try {
      const blob = await exportDB(db, { prettyJson: true });
      downloadData(blob, `guardaditto ${new Date().toLocaleString()}.json`);
    } catch (error) {
      console.error("" + error);
    }
  }
</script>

<main class="h-[270px] p-3 pt-0">
  <ul class="flex flex-col items-start gap-2">
    <!-- <li class="flex w-full justify-center gap-2">
      {#each locales as l}
        <button
          class="{l === locale.lang
            ? 'bg-primary-ditto'
            : ''} text-bold border-accent-ditto ring-offset-background focus-visible:ring-ring hover:bg-primary-ditto active:bg-primary-ditto/150 has-[:checked]:bg-primary-ditto has-[:checked]:border-accent-ditto inline-flex h-8 w-8 items-center justify-center gap-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:text-white disabled:pointer-events-none disabled:opacity-50 has-[:checked]:border-1 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
          onclick={(e) => {
            const target = e.target as HTMLSelectElement | null;
            if (target) {
              locale.lang = target.value;
              chrome.storage.local.set({ lang: target.value });
            }
          }}
          value={l}>{l}</button
        >
      {/each}
    </li> -->
    <li>
      <label class="hover:text-accent-ditto">
        <!-- {t("settings.import")} -->
        {chrome.i18n.getMessage("settings_import")}
        <input type="file" class="hidden" onchange={handleImport} />
      </label>
    </li>
    <li>
      <button onclick={handleExport} class="hover:text-accent-ditto">
        <!-- {t("settings.export")} -->
        {chrome.i18n.getMessage("settings_export")}
      </button>
    </li>
  </ul>
</main>
<foooter class="flex justify-center opacity-20 select-none"
  ><span class="font-main"
    >guardaditto <span class="font-secondary">{`v${VERSION} @ 2025`}</span
    ></span
  ></foooter
>
