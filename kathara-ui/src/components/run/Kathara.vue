<template>
  <v-container grid-list-md>
    <v-layout wrap>
      <v-flex xs12 sm4>
        <v-btn
          :disabled="working"
          outlined
          block
          color="primary"
          @click="submitLab"
        >Submit Laboratory</v-btn>
      </v-flex>
      <v-flex xs12 sm4>
        <v-btn
          :disabled="working"
          outlined
          block
          color="primary"
          @click="startLab"
        >Start Laboratory</v-btn>
      </v-flex>
      <v-flex xs12 sm4>
        <v-btn
          :disabled="working"
          outlined
          block
          color="primary"
          @click="cleanLab"
        >Clean Laboratory</v-btn>
      </v-flex>
      <v-flex xs12 sm4>
        <v-btn
          :disabled="working"
          outlined
          block
          color="primary"
          @click="wipeLab"
        >Wipe Laboratory</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {call_kathara, KatharaFunction, RESTCalls} from "./submit";
import {mapGetters} from "vuex";
import lab from "./lab.json";
import exporter from "../../exporter";
import KatharaRest from "../../builder/KatharaRest";
export default {
  name: "Start",
  computed: {
    ...mapGetters("topology", ["data"], "kathara"),
    working: {
      get() {
        return !!this.$store.state.working;
      },
      set(value) {
        if (value === true) {
          this.$store.commit("clearAlert");
        }
        this.$store.commit("setWorking", { working: value });
      },
    },
  },
  methods: {
    submitLab() {
      this.$log.info('Submitting Lab with data: ', this.data)
      exporter.exportData(this.data)
      this.$log.debug('Exported Lab data: ', this.data)
      const builder = new KatharaRest(exporter.exportData(this.data));
      this.$emit("log", builder.log);
      const script = builder.build();
      this.$log.debug(script)

      //TODO: submit laboratory without example data of lab.json
      call_kathara(KatharaFunction.LCREATE, script).then(response => {
        this.$store.commit("kathara/set_lab",  response)
      });
    },

    startLab() {
      let lab = this.$store.getters['kathara/get_lab'];
      if ( lab.hasOwnProperty("lab_hash")){
        this.$log.info("Starting laboratory with hash ", lab["lab_hash"])

        call_kathara(KatharaFunction.LSTART, lab).then(response => {
          this.$log.info("Response of lstart", response);
        });
      }
    },
    cleanLab() {
      let lab = this.$store.getters['kathara/get_lab'];
      if ( lab.hasOwnProperty("lab_hash")){
        this.$log.info("Stopping laboratory with hash ", lab["lab_hash"])

        call_kathara(KatharaFunction.LCLEAN, lab).then(response => {
          this.$log.info("Response of lclean", response);
        });
      }
    },
    wipeLab() {
      let lab = this.$store.getters['kathara/get_lab'];
      if ( lab.hasOwnProperty("lab_hash")){
        this.$log.info("Wiping laboratory with hash ", lab["lab_hash"])

        call_kathara(KatharaFunction.WIPE, lab).then(response => {
          this.$log.info("Response of lclean", response);
        });
      }
    }
  }
}
</script>

<style scoped>

</style>
