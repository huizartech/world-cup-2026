import { seedGames } from "../src/lib/seed-games";
import "dotenv/config";

seedGames()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
