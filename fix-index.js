require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function fixIndexes() {
  const uri = process.env.MONGODB_URI;
  const dbName = 'auth_app';
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('posts');
    
    // Drop all existing indexes except _id
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);
    
    for (const index of indexes) {
      if (index.name !== '_id_') {
        try {
          await collection.dropIndex(index.name);
          console.log(`Dropped index: ${index.name}`);
        } catch (error) {
          console.log(`Could not drop index ${index.name}:`, error.message);
        }
      }
    }
    
    // Create new indexes
    await collection.createIndex({ title: 'text', content: 'text' });
    await collection.createIndex({ tags: 1 });
    await collection.createIndex({ published: 1 });
    await collection.createIndex({ author: 1 });
    await collection.createIndex({ slug: 1 }, { unique: true });
    
    console.log('Indexes recreated successfully');
    
  } catch (error) {
    console.error('Error fixing indexes:', error);
  } finally {
    await client.close();
  }
}

fixIndexes();