import retry from "async-retry";
import { query } from "#infra/database.js";

async function waitForAllServices(): Promise<void> {
  await waitForWebServer();

  async function waitForWebServer(): Promise<void> {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage(): Promise<void> {
      const response: Response = await fetch(
        "http://localhost:3000/api/v1/status"
      );

      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {

  await query("SET FOREIGN_KEY_CHECKS = 0;");


  const getTablesResult = await query("SHOW TABLES;");
  const tableNames = getTablesResult.map((row: any) => Object.values(row)[0]);


  if (tableNames.length > 0) {
    const dropTablesQuery = `DROP TABLE IF EXISTS ${tableNames.join(", ")};`;
    await query(dropTablesQuery);
  }


  await query("SET FOREIGN_KEY_CHECKS = 1;");
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
};

export default orchestrator;
