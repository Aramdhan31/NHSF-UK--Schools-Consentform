import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
  // Schema is ready; seed demo data here when product requirements are defined.
  await prisma.$connect();
  console.log("Seed: no default rows (empty pass).");
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    void prisma.$disconnect();
    process.exit(1);
  });
