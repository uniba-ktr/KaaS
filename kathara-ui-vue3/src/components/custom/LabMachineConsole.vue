<template>
  <!-- BEGIN #webTTYholder -->
  <card id="consoles-container">
    <card-body>
      <div class="text-white text-opacity-50 mb-3"><b>Device consoles</b></div>
      <div class="row">
        <div class="col-xl-6" v-for="machine in machines">
          <card class="border-theme mb-3">
            <card-header class="border-theme text-theme fw-bold small">WebTTy of {{ machine.name }}</card-header>
            <card-body>
              <iframe
                  width="100%"
                  height="300vh"
                  :title="machine.container_name"
                  :src="`${webTTyBaseURL}/e/${machine.container_id}`"
              >
              </iframe>
            </card-body>
          </card>
        </div>
      </div>
    </card-body>
  </card>
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
#consoles-container {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>