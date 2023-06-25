<template>
  <!-- BEGIN #webTTYholder -->
  <div class="iframe-block" v-for="machine in machines">
      <h4>WebTTY of {{ machine.name }}</h4>
      <iframe
          width="100%"
          height="200vh"
          :title="machine.container_name"
          :src="`${webTTyBaseURL}/e/${machine.container_id}`"
      >
      </iframe>
  </div>
  <!-- END #webTTYholder-->
</template>

<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {useLabStore} from "@/stores/app-lab";
import { Info } from "@/models/api-models"

const { labMachines: machines } = storeToRefs(useLabStore());
const webTTyBaseURL = import.meta.env.VITE_WEBTTY_API_URL;

watch(machines, async (value, oldValue) => {
  if (Object.keys(oldValue).length === 0 && (Object.keys(value).length > 0)) {
    console.log("LabMachineConsole: try to add machine webTTy iframes.")
  }
});

</script>

<style scoped>
.iframe-block {
  margin-bottom: 30px;
}
</style>