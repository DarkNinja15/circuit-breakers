const redis = require("redis");
const client = redis.createClient();

let canCallService1 = true;
const Service1 = require("./service1"); // Import the class, not the function

(async () => {
    const subscriber = client.duplicate();
  
    await subscriber.connect();
    await subscriber.subscribe('circuit-breaker', (message) => {
        console.log(message);
        canCallService1 = JSON.parse(message)['service1'];
    });
})();

class Service2 {
    static callService1() {
        if(canCallService1) {
            Service1.fservice1("Service 2");
        }
        else{
            console.log("cannot call service 1 as it is down!")
        }
    }

    static fservice2(identity) {
        console.log(`Service 2 is called by ${identity}`);
    }
}

module.exports = Service2;

// Start the service if this file is run directly
if (require.main === module) {
    setInterval(()=>{
        Service2.callService1();
    },5000);
}