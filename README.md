### Graphql WebSocket Client 

Simple replacement to query over WebSocket Connection form backend to backend.

Recommended if you need to send over 1000 queries per second. This method is much more efficient than standard Rest.

----

I have just implemented inital feature I need. I you need more just ask!

```
const gqlClient = require('./index')({url: process.env.CALCULATION_SERVICE_LINK || "ws://localhost:4000"});

gqlClient.query(`
    query {
        getCorrectedTheoreticalPower(serial: "E-781156",windSpeed:  12,temperature: -10) {
  	        theoreticalPowerW
        }
    }`)
    .then((x) => {
        console.log(x)
    })

```

