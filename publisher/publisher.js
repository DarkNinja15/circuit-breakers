const redis = require("redis");
const readline = require("readline");

const rl = readline.createInterface(
    process.stdin, process.stdout
);


const publisher = redis.createClient();

async function publishEvent(){
    await publisher.connect();
    let healthcheck = {service1:true,service2:true};
    rl.setPrompt("Enter 1 for healthy and 0 for unhealthy");
    rl.setPrompt("Enter healthiness of services: Service1, Service2");
    rl.prompt();
    rl.on("line",async (line)=>{
        const[service1_health,service2_health]=line.split(" ");
        healthcheck.service1=service1_health;
        healthcheck.service2=service2_health;

        await publisher.publish("circuit-breaker",JSON.stringify(healthcheck));
    });
}

publishEvent();