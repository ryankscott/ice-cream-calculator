import AppDataSource from '../src/server/data-source'

async function main() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
  }

  try {
    await AppDataSource.undoLastMigration()
    console.log('↩️  Last migration reverted')
  } finally {
    await AppDataSource.destroy()
  }
}

main().catch((error) => {
  console.error('Migration revert failed:', error)
  process.exit(1)
})

