const redis = require("redis");
const client = redis.createClient();

let canCallService2 = true;
const Service2 = require("./service2");

(async () => {
    const subscriber = client.duplicate();
  
    await subscriber.connect();
    await subscriber.subscribe('circuit-breaker', (message) => {
        console.log(message);
        canCallService2 = JSON.parse(message).service2;
    });
})();

class Service1 {
    static callService2() {
        if(canCallService2) {
            Service2.fservice2("Service 1");
        }
        else{
            console.log("cannot call service 2 as it is down!")
        }
    }

    static fservice1(identity) {
        console.log(`Service 1 is called by ${identity}`);
    }
}

module.exports = Service1;

// Start the service if this file is run directly
if (require.main === module) {
    setInterval(()=>{
        Service1.callService2();
    },5000);
}