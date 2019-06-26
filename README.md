# Angular vs React vs Vue.js with JHipster 6.1.2

  * [Results](#results)
    + [Round 1](#round-1)
    + [Round 2](#round-2)
  * [Run apps](#run-apps)
  * [Run tests](#run-tests)
    + [Homepage](#homepage)
    + [Entity](#entity)

## Results

### Round 1

![round1-intro](results/round1-intro.png)

![round1-metrics](results/round1-metrics.png)

![round1-lighthouse](results/round1-lighthouse.png)

### Round 2

![round2-intro](results/round2-intro.png)

![round2-metrics](results/round2-metrics.png)

![round2-lighthouse](results/round2-lighthouse.png)

### Bundles

TODO

## Run apps

As the docker images have been pre-published to docker-hub, starting the the demo is as simple as running :

    ./3-run-apps.sh

Your applications will be accessible on these URLs:

- angular: http://localhost:8080
- react: http://localhost:8081
- vuejs: http://localhost:8082

## Run tests

### Homepage

    cd performance-tests
    npm i
    npm run homepage

### Entity

    npm run entity
