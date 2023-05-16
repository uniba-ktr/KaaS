<template>
  <section>
    <h3 class="headline">Description</h3>

    <p>Katharà topology editor for your web browser.</p>

    <p>
      Creates Katharà network scenarios and interacts with Katharà's REST interface.
      <br />
      Imports and exports JSONified network scenarios.
      <br />
      Starts laboratories on a Katharà instance.
      <br />
      Let's you interact with a running laboratory via a TTY interface.
    </p>

    <p v-if="full">
      <v-btn
        class="ma-2"
        outlined
        color="primary"
        target="_blank"
        href="https://github.com/uniba-ktr/KaaS"
      >
        Repository
      </v-btn>
      <v-btn
        class="ma-2"
        outlined
        color="primary"
        target="_blank"
        href="https://github.com/uniba-ktr/KaaS/issues/new"
      >
        New Issue
      </v-btn>
    </p>
  </section>
</template>

<script>
export default {
  name: "AppDescription",
  props: {
    full: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
