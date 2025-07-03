import { createRouter } from "next-connect";
import { Request, Response } from "express";
import { query } from "#infra/database.js";

export async function status(request: Request, response: Response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await query("SELECT version();"); //To do: Update to SHOW
  const databaseVersionValue = databaseVersionResult[0]["version()"];

  const databaseMaxConnectionsResult = await query(
    "SHOW VARIABLES LIKE 'max_connections';"
  );
  const databaseMaxConnectionsValue = databaseMaxConnectionsResult[0].Value;

  const databaseOpenedConnections = await query("SHOW PROCESSLIST;");
  const databaseOpenedConnectionsValue = databaseOpenedConnections.length;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}
