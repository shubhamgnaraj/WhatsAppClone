import redis from 'redis';

const client = redis.createClient();

const connectRedis = async () => {
    try {
        if (!client.isOpen) {
            await client.connect();
            console.log('Connected to Redis ✅');
        }
    } catch (err) {
        console.log('Failed to connect to Redis:', err);
    }
};

connectRedis();

export default client

