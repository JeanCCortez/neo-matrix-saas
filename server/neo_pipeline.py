"""
neo_pipeline.py - Nucleo do pipeline NEO MATRIX (mesma logica validada).
Nao contem NADA de servidor web -- apenas a fisica do pipeline.
Este arquivo e o segredo comercial; nao expor.
"""
import os
import numpy as np
from qiskit import QuantumCircuit, qasm3
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2
from qiskit.transpiler.preset_passmanagers import generate_preset_pass_manager
from qiskit.transpiler import PassManager, InstructionDurations
from qiskit.transpiler.passes import ALAPScheduleAnalysis, PadDynamicalDecoupling
from qiskit.circuit.library import XGate

ZNE_FACTORS = (1, 3, 5, 7)

def _get_seed() -> int:
    env_seed = os.environ.get("NEO_SEED", "").strip()
    if env_seed:
        try:
            return int(env_seed)
        except ValueError:
            pass
    return int.from_bytes(os.urandom(4), "big")

SEED = _get_seed()


class PipelineError(Exception):
    """Erro seguro de mostrar ao cliente (sem detalhe interno)."""
    pass


def get_backend(token, crn, backend_name):
    try:
        service = QiskitRuntimeService(channel="ibm_cloud", token=token, instance=crn)
        return service.backend(backend_name)
    except Exception:
        raise PipelineError(
            "Falha ao conectar com a IBM. Verifique se o token e o CRN "
            "estao corretos e se o backend informado existe e esta acessivel "
            "para sua conta."
        )


def parse_circuit(qasm3_str):
    try:
        return qasm3.loads(qasm3_str)
    except Exception:
        raise PipelineError("Circuito QASM3 invalido ou malformado.")


def calibrate_spam_raw(backend, shots=8192):
    """Calibra t00/t11. Retorna tambem o job_id p/ auditoria."""
    qc0 = QuantumCircuit(1, 1); qc0.measure(0, 0)
    qc1 = QuantumCircuit(1, 1); qc1.x(0); qc1.measure(0, 0)
    pm = generate_preset_pass_manager(optimization_level=1, backend=backend, seed_transpiler=SEED)
    isa0, isa1 = pm.run(qc0), pm.run(qc1)
    sampler = SamplerV2(mode=backend)
    job = sampler.run([isa0, isa1], shots=shots)
    result = job.result()
    c0, c1 = result[0].data.c.get_counts(), result[1].data.c.get_counts()
    t00 = c0.get('0', 0) / sum(c0.values())
    t11 = c1.get('1', 0) / sum(c1.values())
    return t00, t11, job.job_id()


def correct_spam(raw_count, total_shots, t00, t11, target_state):
    prob_raw = raw_count / total_shots
    denom = (t00 ** target_state.count('0')) * (t11 ** target_state.count('1'))
    return max(0, min(1, prob_raw / denom))


def _transpile(qc, backend):
    pm = generate_preset_pass_manager(optimization_level=3, backend=backend, seed_transpiler=SEED)
    return pm.run(qc)


def _apply_shield(isa_qc, backend):
    try:
        durations = InstructionDurations.from_backend(backend)
        pm_dd = PassManager([
            ALAPScheduleAnalysis(durations),
            PadDynamicalDecoupling(durations, [XGate(), XGate()], pulse_alignment=1,
                                    extra_slack_distribution='middle')
        ])
        return pm_dd.run(isa_qc)
    except Exception:
        return isa_qc


def _fold(qc, factor):
    if factor == 1:
        return qc
    folded = QuantumCircuit(*qc.qregs, *qc.cregs)
    num_folds = (factor - 1) // 2
    two_qubit_gates = {'cx', 'cz', 'ecr'}
    for inst in qc.data:
        if len(inst.qubits) == 2 and inst.operation.name in two_qubit_gates:
            folded.append(inst)
            for _ in range(num_folds):
                folded.append(inst.operation.inverse(), inst.qubits)
                folded.append(inst)
        else:
            folded.append(inst)
    return folded


def _zne_linear(factors, fidelities_pct):
    x = np.array(factors, dtype=float)
    y = np.array(fidelities_pct) / 100
    A = np.vstack([x, np.ones(len(x))]).T
    slope, intercept = np.linalg.lstsq(A, y, rcond=None)[0]
    return max(0, min(100, intercept * 100))


def run_execution(token, crn, backend_name, qasm3_str, target_state, shots,
                  t00, t11, spam_cached, progress=None):
    """Executa a parte principal do pipeline usando t00/t11 ja calibrados.
    'spam_cached' indica se a calibracao veio do cache (True) ou foi nova (False)."""
    def step(msg):
        if progress:
            progress(msg)

    step("Validando circuito recebido...")
    qc = parse_circuit(qasm3_str)
    if target_state is None:
        target_state = "0" * qc.num_qubits
    if len(target_state) != qc.num_qubits:
        raise PipelineError("target_state precisa ter o mesmo numero de bits do circuito.")

    step("Conectando ao hardware quantico...")
    backend = get_backend(token, crn, backend_name)

    if spam_cached:
        step("Calibracao ja disponivel (cache valido).")
    else:
        step("Calibracao aplicada.")

    step("Preparando execucao otimizada...")
    isa_qc = _transpile(qc, backend)
    shielded = _apply_shield(isa_qc, backend)
    folded_circs = [_fold(shielded, f) for f in ZNE_FACTORS]

    step("Executando no hardware quantico (isso pode levar alguns minutos)...")
    sampler = SamplerV2(mode=backend)
    job = sampler.run(folded_circs, shots=shots)
    job_id = job.job_id()
    result = job.result()

    step("Aplicando mitigacao de erro e finalizando...")
    fidelities = []
    for pub in result:
        raw = pub.data.c.get_counts().get(target_state, 0)
        fidelities.append(correct_spam(raw, shots, t00, t11, target_state) * 100)
    purified = _zne_linear(ZNE_FACTORS, fidelities)

    step("Concluido.")
    return {
        "job_id": job_id,
        "backend": backend.name,
        "target_state": target_state,
        "shots": shots,
        "purified_fidelity_pct": round(purified, 2),
    }
