import AppDataSource from '../src/server/data-source'

async function main() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
  }

  try {
    await AppDataSource.runMigrations()
    console.log('✅ Migrations executed successfully')
  } finally {
    await AppDataSource.destroy()
  }
}

main().catch((error) => {
  console.error('Migration run failed:', error)
  process.exit(1)
})

