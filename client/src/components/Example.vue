<template>
  <v-container class="example">
    <v-row>
      <v-col cols="4">
        <div
          class="rank-section"
        >
          <div class="text-center font-weight-bold mb-5">
            Select the menus below to update the rank of the companies
          </div>
          <v-select
            :items="companies"
            item-text="company"
            item-value="symbol"
            v-model="rankForm.symbol"
            placeholder="Select a company"
            dense
            outlined
          />
          <v-select
            :items="RANK_OP"
            v-model="rankForm.op"
            placeholder="Add or Subtract"
            dense 
            outlined
          />
          <v-select
            :items="AMOUNT_LIST"
            v-model="rankForm.amount"
            placeholder="Select Amount"
            dense
            outlined
          />
          <v-btn
            color="primary"
            block
            @click="update"
            :disabled="!isValid"
          >
            Update
          </v-btn>
        </div>
      </v-col>
      <v-col cols="8">
        <v-row>
          <v-col cols="6">
            <v-select
              :items="ACTION_LIST"
              v-model="method"
              dense
              outlined
            />
          </v-col>
        </v-row>
        <v-data-table
          :headers="headers"
          :items="companies"
          :loading="loading"
          :disable-pagination="true"
          :hide-default-footer="true"
        >
          <template v-slot:item.rank="{ item }">
            {{ item.rank }}
          </template>
          <template v-slot:item.company="{ item }">
            <div class="d-flex align-center my-2">
              <div>
                <img
                  :src="`https://companiesmarketcap.com//img/company-logos/80/${item.symbol.toUpperCase()}.png`"
                  width="40"
                  height="40"
                  class="mr-3"
                />
              </div>
              <div>
                <div class="">{{ item.company }}</div>
                <div class="grey--text">{{ item.symbol.toUpperCase() }}</div>
              </div>
            </div>
          </template>
          <template v-slot:item.marketCap="{ item }">
            <div class="">{{ formatUSD(item.marketCap) }}</div>
          </template>

          <template v-slot:no-data>
            <span> No Results Found. </span>
          </template>
        </v-data-table>
        <v-btn
          v-if="method === 'paginate'"
          color="primary"
          block
          @click="loadData"
        >
          Load next 10
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="my-5">
      <v-expansion-panels
        v-model="panel"
        multiple
      >
        <v-expansion-panel>
          <v-expansion-panel-header>How the data is stored:</v-expansion-panel-header>
          <v-expansion-panel-content> 
            <ol>
              <li>The company data is stored in a hash like below:
                <pre>HSET "company:AAPL" symbol "AAPL" market_cap "2600000000000" country USA  </pre>
               </li>
              <li>The Ranks are stored in a ZSET. 
                <pre>ZADD companyLeaderboard 2600000000000 company:AAPL</pre>
              </li>
            </ol>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header>How the data is accessed:</v-expansion-panel-header>
          <v-expansion-panel-content>
            <ol>
              <li>Top 10 companies: zrevrange companyLeaderboard 0 9 WITHSCORES </li>
              <li>All companies: zrevange companyLeaderboard 0 -1 WITHSCORES </li>
              <li>Bottom 10 companies: zrange companyLeaderboard 0 9 WITHSCORES</li>
              <li>Between rank 10 and 15: zrevange companyLeaderboard 9 14 WITHSCORES </li>
              <li>Show ranks of AAPL, FB and TSLA: ZMSCORE companyLeaderBoard company:AAPL company:FB company:TSLA </li>
              <li>Pagination: Show 1st 10 companies: ZSCAN 0 companyLeaderBoard COUNT 10 7.Pagination: Show next 10 companies: ZSCAN &lt;return value from the 1st 10 companies&gt; companyLeaderBoard COUNT 10 </li>
              <li>Adding market cap to companies: ZINCRBY companyLeaderBoard 1000000000 "company:FB"</li>
              <li>Reducing market cap to companies: ZINCRBY companyLeaderBoard -1000000000 "company:FB"</li>
              <li>Companies over a Trillion: ZCOUNT companyLeaderBoard 1000000000000 +inf </li>
              <li># companies between 500 billion and 1 trillion: ZCOUNT companyLeaderBoard 500000000000 1000000000000</li>
            </ol>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'

const API_BASE = location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : location.origin + '/api'

const TRILLION = 1000 * 1000 * 1000 * 1000;
const BILLION = 1000 * 1000 * 1000;
const MILLION = 1000 * 1000;

export default {
  name: 'Example',

  components: {
  },

  props: {
  },

  data: () => ({
    loading: false,
    companies: [],
    headers: [
      { text: 'Rank', value: 'rank', sortable: false },
      { text: 'Name', value: 'company', sortable: false },
      { text: 'Market Cap', value: 'marketCap', sortable: false },
      { text: 'Country', value: 'country', sortable: false },
    ],
    method: 'top10',
    RANK_OP: [
      { text: 'Add', value: 'add' },
      { text: 'Subtract', value: 'subtract' },
    ],
    AMOUNT_LIST: [
      { text: '10 Billions', value: BILLION * 10 },
      { text: '100 Billions', value: BILLION * 100 },
      { text: '1 Trillion', value: TRILLION },
      { text: '2 Trillion', value: TRILLION * 2 },
    ],
    rankForm: {
      symbol: '',
      op: '',
      amount: '',
    },
    startPaginate: 0,
    ACTION_LIST: [
      { text: 'Top 10 companies', value: 'top10' },
      { text: 'All companies', value: 'all' },
      { text: 'Bottom 10 companies', value: 'bottom10' },
      { text: 'Between Rank 10 & 15', value: 'inRank?start=9&end=14' },
      { text: 'Show Ranks of AAPL, FB and TSLA', value: 'getBySymbol?symbols[]=aapl&symbols[]=fb&symbols[]=tsla' },
      { text: 'Pagination: Show 1st 10', value: 'paginate' },
      // { text: 'Pagination: Show Next 10', value: 'paginate' },
    ],
  }),

  computed: {
    isValid () {
      return !!this.rankForm.symbol && !!this.rankForm.op && !!this.rankForm.amount
    },
  },

  watch: {
    method: {
      handler () {
        this.loadData()
      },
      immediate:true,
    },
  },

  created () {
  },

  methods: {
    async update () {
      this.loading = true
      try {
        const form = {
          symbol: this.rankForm.symbol,
          amount: this.rankForm.op === 'add' ? this.rankForm.amount : -1 * this.rankForm.amount,
        }

        await axios.get(`${API_BASE}/rank/update`, { params: form })

        this.rankForm = {
          symbol: '',
          op: '',
          amount: '',
        }
        this.loadData()
      } catch (err) {
        console.log(err)
        // catch err
      }
      this.loading = false
    },
    async loadData () {      
      this.loading = true
      try {
        let method = this.method
        if (this.method === 'paginate') {
          method = `inRank?start=${this.startPaginate}&end=${this.startPaginate+10}`
          this.startPaginate += 10
        }

        const apiResp = await axios.get(`${API_BASE}/list/${method}`)
        this.companies = apiResp.data
      } catch (err) {
        console.log(err)
        // catch err
      }
      this.loading = false
    },
    formatUSD (usd) {
      if (usd > TRILLION) {
        return `$ ${(usd / TRILLION).toFixed(3)} T`
      }
      if (usd > BILLION) {
        return `$ ${(usd / BILLION).toFixed(2)} B`
      }
      if (usd > MILLION) {
        return `$ ${(usd / MILLION).toFixed(1)} M`
      }
      return `$ ${usd}`
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.rank-section {
  border: 1px solid #5e5e5e;
  border-radius: 5px;
  padding: 20px;
}
</style>
