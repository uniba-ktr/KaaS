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
  console.log("Inside draggableConsole machine=" + machineInfo.name)
  emit('closeConsoleFrame', machineInfo.name);
}

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
        height="85%"
        :title="machineInfo.container_name"
        :src="`${webTTyBaseURL}/e/${machineInfo.container_id}`"
      >
      </iframe>
      <button
        type="button"
        class="btn btn-outline-warning"
        @click="closeConsoleFrame"
      >
        Close
      </button>
    </card-body>
  </card>
</template>

<style scoped>
.console-container {
  width: 640px;
  height: 360px;
}
</style>