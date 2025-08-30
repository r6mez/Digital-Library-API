const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB connection options for replica set
    const options = {
      // Replica set options
      replicaSet: process.env.MONGO_REPLICA_SET || undefined,
      readPreference: 'primary',
      retryWrites: true,
      w: 'majority',
      
      // Connection options
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      
      // Buffer settings
      bufferCommands: false,
    };

    // Remove undefined options
    Object.keys(options).forEach(key => {
      if (options[key] === undefined) {
        delete options[key];
      }
    });

    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Connection Type: ${conn.connection.db.options?.replicaSet ? 'Replica Set' : 'Standalone'}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;