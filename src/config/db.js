import mongoose from 'mongoose';
import dns from 'node:dns';

const connectDB = async () => {
  try {
    if (process.env.DNS_SERVERS) {
      dns.setServers(process.env.DNS_SERVERS.split(',').map((server) => server.trim()));
    }

    await mongoose.connect(process.env.MONGO_URI, {
        dbName: 'aiCopilot',
    });
    console.log('MongoDB connected successfully');
    } catch (error) {       
    console.error('MongoDB connection error:', error);
    }
}

    export default connectDB;
