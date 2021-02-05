
# Basic Redis Leaderboard Demo NodeJS

Show how the redis works with NodeJS, Express.

## Try it out

<p>
    <a href="https://heroku.com/deploy" target="_blank">
        <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy to Heorku" width="200px"/>
    <a>
</p>

<p>
    <a href="https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fredis-developer%2Fbasic-redis-leaderboard-demo-nodejs&env=REDIS_ENDPOINT_URI,REDIS_PASSWORD&envDescription=REDIS_ENDPOINT_URI%20is%20required%20at%20least%20to%20connect%20to%20Redis%20clouding%20server" target="_blank">
        <img src="https://vercel.com/button" alt="Deploy with Vercel" width="200px" height="50px"/>
    </a>
</p>

<p>
    <a href="https://deploy.cloud.run" target="_blank">
        <img src="https://deploy.cloud.run/button.svg" alt="Run on Google Cloud" width="200px"/>
    </a>
    (See notes: How to run on Google Cloud)
</p>


## How to run on Google Cloud

<p>
    If you don't have redis yet, plug it in  (https://spring-gcp.saturnism.me/app-dev/cloud-services/cache/memorystore-redis).
    After successful deployment, you need to manually enable the vpc connector as shown in the pictures:
</p>

1. Open link google cloud console.

![1 step](docs/1.png)

2. Click "Edit and deploy new revision" button.

![2 step](docs/2.png)

3. Add environment.

![3 step](docs/3.png)

4.  Select vpc-connector and deploy application.

![4  step](docs/4.png)

<a href="https://github.com/GoogleCloudPlatform/cloud-run-button/issues/108#issuecomment-554572173">
Problem with unsupported flags when deploying google cloud run button
</a>

## How it works?

![How it works](docs/screenshot001.png)


# How it works?
## 1. How the data is stored:
<ol>
    <li>The company data is stored in a hash like below:
      <pre>HSET "company:AAPL" symbol "AAPL" market_cap "2600000000000" country USA</pre>
     </li>
    <li>The Ranks are stored in a ZSET. 
      <pre>ZADD companyLeaderboard 2600000000000 company:AAPL</pre>
    </li>
</ol>

<br/>

## 2. How the data is accessed:
<ol>
    <li>Top 10 companies: <pre>ZREVRANGE companyLeaderboard 0 9 WITHSCORES</pre> </li>
    <li>All companies: <pre>ZREVRANGE companyLeaderboard 0 -1 WITHSCORES</pre> </li>
    <li>Bottom 10 companies: <pre>ZRANGE companyLeaderboard 0 9 WITHSCORES</pre></li>
    <li>Between rank 10 and 15: <pre>ZREVRANGE companyLeaderboard 9 14 WITHSCORES</pre></li>
    <li>Show ranks of AAPL, FB and TSLA: <pre>ZSCORE companyLeaderBoard company:AAPL company:FB company:TSLA</pre> </li>
    <!-- <li>Pagination: Show 1st 10 companies: <pre>ZSCAN 0 companyLeaderBoard COUNT 10 7.Pagination: Show next 10 companies: ZSCAN &lt;return value from the 1st 10 companies&gt; companyLeaderBoard COUNT 10 </li> -->
    <li>Adding market cap to companies: <pre>ZINCRBY companyLeaderBoard 1000000000 "company:FB"</pre></li>
    <li>Reducing market cap to companies: <pre>ZINCRBY companyLeaderBoard -1000000000 "company:FB"</pre></li>
    <li>Companies over a Trillion: <pre>ZCOUNT companyLeaderBoard 1000000000000 +inf</pre> </li>
    <li>Companies between 500 billion and 1 trillion: <pre>ZCOUNT companyLeaderBoard 500000000000 1000000000000</pre></li>
</ol>

## How to run it locally?

#### Copy `.env.sample` to create `.env`. And provide the values for environment variables

    - REDIS_ENDPOINT_URI: Redis server URI
    - REDIS_PASSWORD: Password to the server

#### Run frontend

```sh
cd client
npm run serve
```

#### Run backend

``` sh
npm start
```
