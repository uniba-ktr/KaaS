<template>
  <!-- BEGIN #webTTYholder -->
  <div v-for="machine in machines">
    <div class="modal fade" :id="machine.container_id" tabindex="-1">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">WebTTy of {{ machine.name }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <iframe
              width="100%"
              height="200vh"
              :title="machine.container_name"
              :src="`${webTTyBaseURL}/e/${machine.container_id}`"
            >
            </iframe>
          </div>
        </div>
      </div>
    </div>
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

</style>