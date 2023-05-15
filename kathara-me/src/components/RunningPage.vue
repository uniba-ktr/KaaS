<template>
  <v-container grid-list-md>
    <v-layout wrap>
      <v-flex xs12 py-5>
        <h3 class="headline">Kathara Laboratories</h3>
        <Kathara />
      </v-flex>

      <v-flex xs12 pb-5>
        <h3 class="headline">Statistics</h3>
        <Statistics />
      </v-flex>


      <div style="height: 0px; width: 0px; overflow: hidden">
        <VisCanvas
          v-if="visCanvasOn"
          ref="visCanvas"
          :dark="dark"
          @ready="visCanvasResolve"
        />
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import Kathara from "./run/Kathara.vue";
import Statistics from "./run/Statistics.vue";
import VisCanvas from "@/components/vis/VisCanvas";
import LogListing from "./export/LogListing";

export default {
  name: "RunningPage",
  components: {Kathara, Statistics, VisCanvas, LogListing},
  data: () => ({
    visCanvasOn: false,
    visCanvasResolve: () => {},
    dark: false,
    log: [],
  }),
  computed: {
    loading() {
      return this.$store.state.loading;
    }
  }
};
</script>
