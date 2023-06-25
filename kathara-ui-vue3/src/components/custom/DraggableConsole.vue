<script setup lang="ts">
import {useLabStore} from "@/stores/app-lab";
import type {Info} from "@/models/api-models";

const { machine_name } = defineProps(['machine_name']);
const webTTyBaseURL = import.meta.env.VITE_WEBTTY_API_URL;

const labStore = useLabStore();

const machineInfo: Info = <Info>labStore.getMachineInfo(machine_name);

</script>

<template>
  <card
      class="bg-dark border-theme bg-opacity-75 mb-3 console-container"
      v-drag
  >
    <card-header class="border-theme fw-bold small text-inverse">WebTTy of {{ machineInfo.name }}</card-header>
    <card-body>
      <iframe
          width="100%"
          height="100%"
          :title="machineInfo.container_name"
          :src="`${webTTyBaseURL}/e/${machineInfo.container_id}`"
      >
      </iframe>
    </card-body>
  </card>
</template>

<style scoped>
.console-container {
  width: 640px;
  height: 360px;
}
</style>