<script lang="ts">
  import { db } from "../background/background";
  import { importDB, exportDB, importInto } from "dexie-export-import";

  const options = {
    acceptVersionDiff: true, // Ignore version differences between databases
    overwriteValues: true, // Overwrite existing values in the database
    clearTablesBeforeImport: false, // Do not clear tables before importing
  };

  async function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const blobFile = new Blob([file], { type: "application/json" });
      await importInto(db, blobFile, options);
      // refresh badge
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
      downloadData(blob, `guardaditto ${new Date().toLocaleString()}.json`); // change name
    } catch (error) {
      console.error("" + error);
    }
  }
</script>

<main class="h-[270px] p-3 pt-0">
  <ul class="flex flex-col items-start gap-2">
    <li>
      <label class="hover:text-accent-ditto">
        Import database
        <input type="file" class="hidden" onchange={handleImport} />
      </label>
    </li>
    <li>
      <button onclick={handleExport} class="hover:text-accent-ditto"
        >Export database</button
      >
    </li>
  </ul>
</main>
<foooter class="flex justify-center opacity-20"
  >{`v.${import.meta.env.VITE_APP_VERSION} @ 2025`}</foooter
>
