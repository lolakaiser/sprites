import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;

async function getClient() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const c = await getClient();
    const db = c.db('sprite-tracker');
    const col = db.collection('owned');

    if (req.method === 'GET') {
      const docs = await col.find({}).toArray();
      // shape: { player: "lola", spriteId: "water", variantIdx: 0, owned: true }
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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
