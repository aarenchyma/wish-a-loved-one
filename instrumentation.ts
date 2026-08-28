export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { connectDB } = await import('@/lib/db');
    await connectDB();
    console.log('✓ MongoDB connected at startup');
  }
}