interface BaseErrorParams {
  cause?: Error | unknown;
  message?: string;
  action?: string;
}

interface InternalServerErrorParams extends BaseErrorParams {
  statusCode?: number;
}

interface ErrorJSON {
  name: string;
  message: string;
  action: string;
  status_code: number;
}

export class InternalServerError extends Error {
  public readonly name: string;
  public readonly action: string;
  public readonly statusCode: number;

  constructor({ cause, statusCode }: InternalServerErrorParams = {}) {
    super("Um erro interno não esperado aconteceu.", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Entre em contato com o suporte.";
    this.statusCode = statusCode || 500;
  }

  toJSON(): ErrorJSON {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  public readonly name: string;
  public readonly action: string;
  public readonly statusCode: number;

  constructor({ cause, message }: BaseErrorParams = {}) {
    super(message || "Serviço indisponível no momento.", {
      cause,
    });
    this.name = "ServiceError";
    this.action = "Verifique se o serviço está disponível.";
    this.statusCode = 503;
  }

  toJSON(): ErrorJSON {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ValidationError extends Error {
  public readonly name: string;
  public readonly action: string;
  public readonly statusCode: number;

  constructor({ cause, message, action }: BaseErrorParams = {}) {
    super(message || "Um erro de validação ocorreu.", {
      cause,
    });
    this.name = "ValidationError";
    this.action = action || "Ajuste os dados enviados e tente novamente.";
    this.statusCode = 400;
  }

  toJSON(): ErrorJSON {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class NotFoundError extends Error {
  public readonly name: string;
  public readonly action: string;
  public readonly statusCode: number;

  constructor({ cause, message, action }: BaseErrorParams = {}) {
    super(message || "Não foi possível encontrar este recurso no sistema.", {
      cause,
    });
    this.name = "NotFoundError";
    this.action =
      action || "Verifique se os parâmetros enviados na consulta estão certos.";
    this.statusCode = 404;
  }

  toJSON(): ErrorJSON {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class UnauthorizedError extends Error {
  public readonly name: string;
  public readonly action: string;
  public readonly statusCode: number;

  constructor({ cause, message, action }: BaseErrorParams = {}) {
    super(message || "Usuário não autenticado.", {
      cause,
    });
    this.name = "UnauthorizedError";
    this.action = action || "Faça novamente o login para continuar.";
    this.statusCode = 401;
  }

  toJSON(): ErrorJSON {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  public readonly name: string;
  public readonly action: string;
  public readonly statusCode: number;

  constructor() {
    super("Método não permitido para este endpoint.");
    this.name = "MethodNotAllowedError";
    this.action =
      "Verifique se o método HTTP enviado é válido para este endpoint.";
    this.statusCode = 405;
  }

  toJSON(): ErrorJSON {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
