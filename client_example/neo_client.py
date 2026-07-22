"""
neo_client.py - Cliente NEO MATRIX (roda no terminal do usuario).

Uso:
  export NEO_API_KEY="sua_api_key_nossa"
  export IBM_TOKEN="seu_token_ibm"
  export IBM_CRN="seu_crn_ibm"
  python neo_client.py caminho/para/circuito.qasm3 --backend ibm_fez --shots 4096

O token IBM eh enviado a cada chamada e nunca eh salvo pelo servidor
(modo efemero). Voce pode conferir isso auditando os endpoints do
servidor (nao ha campo de "ibm_token" em /v1/me/usage nem no db).
"""
import os
import sys
import json
import argparse
import requests

NEO_API_URL = os.environ.get("NEO_API_URL", "https://SEU-DOMINIO-AQUI/v1/run")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("qasm_file", help="Arquivo com o circuito em QASM3")
    parser.add_argument("--backend", required=True, help="Ex: ibm_fez, ibm_kingston, ibm_marrakesh")
    parser.add_argument("--shots", type=int, default=4096)
    parser.add_argument("--target", default=None, help="Estado alvo (opcional; padrao: 000...)")
    args = parser.parse_args()

    neo_api_key = os.environ.get("NEO_API_KEY")
    ibm_token = os.environ.get("IBM_TOKEN")
    ibm_crn = os.environ.get("IBM_CRN")

    missing = [n for n, v in [("NEO_API_KEY", neo_api_key), ("IBM_TOKEN", ibm_token),
                              ("IBM_CRN", ibm_crn)] if not v]
    if missing:
        sys.exit(f"Erro: defina as variaveis de ambiente: {', '.join(missing)}.")

    with open(args.qasm_file) as f:
        qasm3_content = f.read()

    payload = {
        "ibm_token": ibm_token, "ibm_crn": ibm_crn,
        "backend_name": args.backend, "qasm3": qasm3_content,
        "target_state": args.target, "shots": args.shots,
    }
    headers = {"X-API-Key": neo_api_key}

    print(f"Enviando circuito para o NEO MATRIX ({args.backend})...\n")

    with requests.post(NEO_API_URL, json=payload, headers=headers,
                        stream=True, timeout=1200) as resp:
        if resp.status_code >= 400:
            try:
                print(f"ERRO ({resp.status_code}):", resp.json())
            except Exception:
                print(f"ERRO ({resp.status_code}):", resp.text)
            sys.exit(1)
        for line in resp.iter_lines(decode_unicode=True):
            if not line:
                continue
            if line.startswith("RESULT:"):
                result = json.loads(line[len("RESULT:"):])
                print("\n--- Resultado ---")
                print(f"Backend       : {result['backend']}")
                print(f"IBM Job ID    : {result['job_id']}")
                print(f"Fidelidade    : {result['purified_fidelity_pct']}%")
                print(f"Tokens usados : {result['tokens_charged']}")
                print(f"Saldo restante: {result['tokens_balance']}")
                if result.get("spam_cached"):
                    print("(Calibracao reutilizada do cache - sem custo extra da IBM)")
                else:
                    print(f"(Calibracao nova feita - IBM job: {result['calibration_ibm_job_id']})")
            elif line.startswith("ERRO:"):
                print(line)
            else:
                print(line)


if __name__ == "__main__":
    main()
