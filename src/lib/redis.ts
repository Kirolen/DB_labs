import { createClient } from "redis";

export const redis = createClient({
    username: "default",
    password: "aOuJg04B4PTqABh1PS3DWSNDfRB5iUEu",
    socket: {
        host: "redis-18789.c14.us-east-1-3.ec2.cloud.redislabs.com",
        port: 18789
    }
});

redis.on("connect", () => {
    console.log("🔌 Redis Cloud connected");
});

redis.on("error", (err) => {
    console.error("❌ Redis Client Error", err);
});

export async function initRedis() {
    try {
        if (!redis.isOpen) {
            await redis.connect();
        }
    } catch (err) {
        console.error("❌ Redis Cloud connection failed", err);
    }
}
