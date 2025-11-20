require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function dropPostsCollection() {
  const uri = process.env.MONGODB_URI;
  const dbName = 'auth_app';
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db(dbName);
    
    // Drop the posts collection entirely to remove all indexes
    try {
      await db.collection('posts').drop();
      console.log('Posts collection dropped successfully');
    } catch (error) {
      if (error.code === 26) {
        console.log('Posts collection does not exist');
      } else {
        throw error;
      }
    }
    
    console.log('Collection reset complete');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

dropPostsCollection();