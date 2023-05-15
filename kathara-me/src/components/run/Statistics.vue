<template>
  <v-container grid-list-md>
    <v-layout wrap>
      <v-flex xs12>
        <v-btn
          :disabled="working"
          outlined
          block
          color="primary"
          @click="getStats"
        >Get Laboratory statistics</v-btn>
        <v-btn
          :disabled="working"
          outlined
          block
          color="primary"
          @click="sendMessage"
        >Send WS Message</v-btn>
      </v-flex>
      <v-flex xs12 sm4 v-for="item in machines">
        <v-btn
          :disabled="working"
          outlined
          block
          color="primary"
          @click="openIframe(item)">
          {{ item.name }}
        </v-btn>
      </v-flex>
      <v-flex xs12>
        <div class="container" v-if="selected_container">
          <iframe
            :src="web_tty+selected_container"
            width="100%"
            height="300">
          </iframe>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {call_kathara, KatharaFunction} from "./submit";
import {mapGetters} from "vuex";
import Vue from "vue";
import ReconnectingWebSocket from 'reconnecting-websocket';
export default {
  name: "Statistics",
  data: () => ({
    machines: [],
    selected_container: null,
    web_tty: "http://localhost:8001/e/"
  }),
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
  mounted() {
    //this.$store.dispatch('fetchButtons');
    this.$log.info('Starting connection to WebSocket Server');
    this.connection = new ReconnectingWebSocket('ws://localhost:8000/ws');
    this.connection.onmessage = (event) => {
      Vue.$log.info("Websocket Event: ", event)
    };

    this.connection.onopen = (event) => {
      Vue.$log.info("WebSocket opened: ", event)
    };

    this.connection.onerror = (err) => {
      Vue.$log.error(err.message);
      this.connection.close();
    };
  },
  methods: {
    sendMessage() {
      let lab = this.$store.getters['kathara/get_lab'];
      this.connection.send(JSON.stringify(lab));
    },
    getStats() {
      let lab = this.$store.getters['kathara/get_lab'];
      if ( lab.lab_hash != null){
        this.$log.info("Getting statistics for laboratory with hash ", lab["lab_hash"])

        call_kathara(KatharaFunction.LINFO, lab).then(response => {
          this.$emit("log", response["info"])
          this.$log.debug(response);
          if (response["info"] != null) {
            this.showSelections(response["info"])
          }else{
            this.$log.warn("Laboratory does not provide any information", response)
          }
        });
      }else{
        this.$log.warn("Laboratory not initialized with hash value", lab)
      }
    },
    showSelections(lab_info){
      this.$log.debug("selecting machine of", lab_info)
      for (const key in lab_info) {
        let machine = lab_info[key]
        if (!this.machines.find(m => m["name"] === machine["name"])) {
          this.$log.debug("Adding", machine["name"], machine["container_id"])
          this.machines.push({name: machine["name"], container_id: machine["container_id"]})
        }
      }
    },
    openIframe(machine){
      this.$log.debug("Opening Iframe for container ID", machine.container_id)
      this.selected_container = machine.container_id
    }

}

}
</script>

<style scoped>

</style>
