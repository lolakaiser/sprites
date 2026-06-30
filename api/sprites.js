import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let clientPromise;

function getClientPromise() {
  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect().then(() => client);
  }
  return clientPromise;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  let client;
  try {
    client = await getClientPromise();
  } catch (err) {
    clientPromise = null;
    return res.status(500).json({ error: 'DB connection failed: ' + err.message });
  }

  try {
    const col = client.db('sprite-tracker').collection('owned');

    if (req.method === 'GET') {
      const docs = await col.find({}).toArray();
      const result = {};
      docs.forEach(d => {
        if (!result[d.player]) result[d.player] = {};
        result[d.player][d.spriteId + '_' + d.variantIdx] = d.owned;
      });
      return res.status(200).json(result);
    }

    if (req.method === 'POST') {
      const { player, spriteId, variantIdx, owned } = req.body;
      if (!player || !spriteId || variantIdx === undefined) {
        return res.status(400).json({ error: 'Missing fields' });
      }
      await col.updateOne(
        { player, spriteId, variantIdx },
        { $set: { player, spriteId, variantIdx, owned } },
        { upsert: true }
      );
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    clientPromise = null;
    res.status(500).json({ error: err.message });
  }
}
