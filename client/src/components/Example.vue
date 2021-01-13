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
    async loadData () {      
      try {
        const apiResp = await axios.get(`${API_BASE}/list/top10`)
        const data = apiResp.data

        return {
          ...data,
        }
      } catch (err) {
        console.log(err)
        // catch err
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
