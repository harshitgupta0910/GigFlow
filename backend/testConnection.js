import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('📍 URI:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@'));
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log('📊 Host:', conn.connection.host);
    console.log('🗄️  Database:', conn.connection.name);
    console.log('\n🎉 Connection test passed! Your backend is ready to run.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed!');
    console.error('Error:', error.message);
    console.log('\n💡 Troubleshooting Tips:');
    console.log('1. Verify your MongoDB Atlas credentials');
    console.log('2. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('3. Ensure the database user has proper permissions');
    console.log('4. Try updating the password (avoid special characters)');
    
    process.exit(1);
  }
};

testConnection();
