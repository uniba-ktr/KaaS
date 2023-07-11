<script setup lang="ts">
const emit = defineEmits(['closeConsoleFrame'])
import {useLabStore} from "@/stores/app-lab";
import type {Info} from "@/models/api-models";

const props = defineProps<{
  machine_name: string,
}>()
const webTTyBaseURL = import.meta.env.VITE_WEBTTY_API_URL;

const labStore = useLabStore();
const machineInfo: Info = <Info>labStore.getMachineInfo(props.machine_name);

const closeConsoleFrame = () => {
  emit('closeConsoleFrame', machineInfo.name);
}

</script>

<template>
  <card
    class="bg-dark border-theme bg-opacity-75 mb-3 console-container"
    v-drag
  >
    <card-header class="border-theme d-flex fw-bold small text-inverse justify-content-between">
      WebTTy of {{ machineInfo.name }}
      <button
          type="button"
          class="close btn btn-outline-warning btn-sm me-1"
          aria-label="Close"
          @click="closeConsoleFrame"
      >
        <span aria-hidden="true">×</span>
      </button>
    </card-header>
    <card-body>
      <iframe
        width="100%"
        height="85%"
        :title="machineInfo.container_name"
        :src="`${webTTyBaseURL}/e/${machineInfo.container_id}`"
      >
      </iframe>
    </card-body>
    <div class="card-arrow"><div class="card-arrow-top-left"></div><div class="card-arrow-top-right"></div><div class="card-arrow-bottom-left"></div><div class="card-arrow-bottom-right"></div></div>
  </card>
</template>

<style scoped>
.console-container {
  width: 640px;
  height: 360px;
}
</style>
