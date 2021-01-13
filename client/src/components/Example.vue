<template>
  <div class="example">
    XX
  </div>
</template>

<script>
import axios from 'axios'

const API_BASE = location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : location.origin

export default {
  name: 'Example',

  components: {
  },

  props: {
  },

  data: () => ({
  }),

  methods: {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
