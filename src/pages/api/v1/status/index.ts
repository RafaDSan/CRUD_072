import { Router, Request, Response } from "express";
import { query } from "#infra/database.js";
import { ServiceError, InternalServerError } from "#infra/errors.js";
import { asyncHandler, methodNotAllowed } from "#infra/controller.js";

const statusRouter = Router();

statusRouter.get("/", asyncHandler(getHandler));

statusRouter.all("/", methodNotAllowed);

export default statusRouter;

async function getHandler(request: Request, response: Response) {
  try {
    const updatedAt = new Date().toISOString();

    const databaseVersionResult = await query("SELECT version();");

    if (!databaseVersionResult?.[0]?.["version()"]) {
      throw new ServiceError({
        message: "Não foi possível obter a versão do banco de dados.",
      });
    }

    const databaseVersionValue = databaseVersionResult[0]["version()"];
    const databaseMaxConnectionsResult = await query(
      "SHOW VARIABLES LIKE 'max_connections';"
    );

    if (!databaseMaxConnectionsResult?.[0]?.Value) {
      throw new ServiceError({
        message: "Não foi possível obter o número máximo de conexões.",
      });
    }

    const databaseMaxConnectionsValue = parseInt(
      databaseMaxConnectionsResult[0].Value,
      10
    );

    if (isNaN(databaseMaxConnectionsValue)) {
      throw new ServiceError({
        message: "Valor de conexões máximas inválido.",
      });
    }

    const databaseOpenedConnections = await query("SHOW PROCESSLIST;");

    if (!Array.isArray(databaseOpenedConnections)) {
      throw new ServiceError({
        message: "Resposta inválida ao consultar conexões abertas.",
      });
    }

    const databaseOpenedConnectionsValue = databaseOpenedConnections.length;

    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: databaseVersionValue,
          max_connections: databaseMaxConnectionsValue,
          opened_connections: databaseOpenedConnectionsValue,
        },
      },
    });
  } catch (error) {
    console.log("\n Erro dentro do catch do controller:");
    console.error(error);

    if (error instanceof ServiceError) {
      response.status(error.statusCode).json(error.toJSON());
    } else {
      const publicErrorObject = new InternalServerError({ cause: error });
      response
        .status(publicErrorObject.statusCode)
        .json(publicErrorObject.toJSON());
    }
  }
}
