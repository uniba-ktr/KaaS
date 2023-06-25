<template>
    <card
        class="bg-theme border-dark bg-opacity-50 mb-3 console-container"
        v-for="machine in machines"
        v-show="ttyFrames.indexOf(machine.name) !== -1"
        v-drag
    >
      <card-header class="border-dark fw-bold small text-inverse">WebTTy of {{ machine.name }}</card-header>
      <card-body>
        <iframe
            width="100%"
            height="100%"
            :title="machine.name"
            :src="`${webTTyBaseURL}/e/${machine.container_id}`"
        >
        </iframe>
      </card-body>
    </card>
</template>

<script setup lang="ts">
import {watch} from "vue";
import {storeToRefs} from "pinia";
import {useLabStore} from "@/stores/app-lab";
const { labMachines: machines, showTTyFrames: ttyFrames } = storeToRefs(useLabStore());
const webTTyBaseURL = import.meta.env.VITE_WEBTTY_API_URL;

watch(machines, async (value, oldValue) => {
  if (Object.keys(oldValue).length === 0 && (Object.keys(value).length > 0)) {
    console.log("LabMachineConsole: try to add machine webTTy iframes.")
  }
});
</script>

<style scoped>
.console-container {
  width: 640px;
  height: 360px;
}
</style>