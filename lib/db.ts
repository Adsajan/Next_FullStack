import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const globalForMongoose = global as typeof globalThis & {
  mongooseConnection?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

// Cache the connection across hot reloads in development.
const cached =
  globalForMongoose.mongooseConnection ??
  (globalForMongoose.mongooseConnection = { conn: null, promise: null });

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables.");
  }
  return uri;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoUri = getMongoUri();
    cached.promise = mongoose
      .connect(mongoUri, {
        dbName: process.env.MONGODB_DB || undefined
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}