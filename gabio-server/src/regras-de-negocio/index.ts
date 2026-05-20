import { contas } from "../dados/contas";
import { GbtpRequest, GbtpResponse } from "../types/protocol";

export function processarOperacao(request: GbtpRequest): GbtpResponse {
  switch (request.operation) {
    case "BALANCE":
      return consultarSaldo(request);
    case "DEPOSIT":
      return realizarDeposito(request);
    case "WITHDRAW":
      return realizarSaque(request);
    case "TRANSFER":
      return realizarTransferencia(request);
  }
}

// ─── BALANCO ────────────────────────────────────────────────────────────────

function consultarSaldo(request: GbtpRequest): GbtpResponse {
  const conta = contas.find((c) => c.id === request.accountId);

  if (!conta) {
    return erro(`Conta ${request.accountId} nao encontrada.`);
  }

  return sucesso("Saldo consultado com sucesso.", conta.saldo);
}

// ─── DEPOSITO ────────────────────────────────────────────────────────────────

function realizarDeposito(request: GbtpRequest): GbtpResponse {
  const conta = contas.find((c) => c.id === request.accountId);

  if (!conta) {
    return erro(`Conta ${request.accountId} nao encontrada.`);
  }

  if (request.value <= 0) {
    return erro("O valor do deposito deve ser maior que zero.");
  }

  conta.saldo += request.value;

  return sucesso("Deposito realizado com sucesso.", conta.saldo);
}

// ─── SAQUE ───────────────────────────────────────────────────────────────

function realizarSaque(request: GbtpRequest): GbtpResponse {
  const conta = contas.find((c) => c.id === request.accountId);

  if (!conta) {
    return erro(`Conta ${request.accountId} nao encontrada.`);
  }

  if (request.value <= 0) {
    return erro("O valor do saque deve ser maior que zero.");
  }

  if (conta.saldo < request.value) {
    return erro("Saldo insuficiente para realizar o saque.");
  }

  conta.saldo -= request.value;

  return sucesso("Saque efetuado com sucesso.", conta.saldo);
}

// ─── TRANSFERIR ───────────────────────────────────────────────────────────────

function realizarTransferencia(request: GbtpRequest): GbtpResponse {
  const contaOrigem = contas.find((c) => c.id === request.accountId);

  if (!contaOrigem) {
    return erro(`Conta de origem ${request.accountId} nao encontrada.`);
  }

  const contaDestino = contas.find((c) => c.id === request.toAccountId);

  if (!contaDestino) {
    return erro(`Conta de destino ${request.toAccountId} nao encontrada.`);
  }

  if (request.accountId === request.toAccountId) {
    return erro("Nao e permitido transferir para a mesma conta.");
  }

  if (request.value <= 0) {
    return erro("O valor da transferencia deve ser maior que zero.");
  }

  if (contaOrigem.saldo < request.value) {
    return erro("Saldo insuficiente para realizar a transferencia.");
  }

  contaOrigem.saldo -= request.value;
  contaDestino.saldo += request.value;

  return sucesso("Transferencia concluida com sucesso.", contaOrigem.saldo);
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

function sucesso(message: string, balance: number): GbtpResponse {
  return { status: "OK", message, balance };
}

function erro(message: string): GbtpResponse {
  return { status: "ERROR", message, balance: null };
}