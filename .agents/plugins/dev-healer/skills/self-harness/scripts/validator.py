import json
import os
import sys
import subprocess

DATA_DIR = os.environ.get('ANTIGRAVITY_EXECUTABLE_DATA_DIR', '.agents/scratch')
RESULTS_FILE = os.path.join(DATA_DIR, 'validation-results.json')
COST_THRESHOLD = 0.5 # Configured per persona

def execute_validation():
    print("[Validator] Compiling candidate harness configurations in-memory...")
    
    # Execute the eval_runner to generate the validation-results.json
    eval_script = os.path.join(os.path.dirname(__file__), 'eval_runner.py')
    res = subprocess.run([sys.executable, eval_script])
    
    if res.returncode != 0:
        print("[Validator] eval_runner crashed. Rejecting candidate.")
        sys.exit(1)
        
    if not os.path.exists(RESULTS_FILE):
        print(f"[Validator] Missing {RESULTS_FILE}. Rejecting candidate.")
        sys.exit(1)
        
    with open(RESULTS_FILE, 'r') as f:
        data = json.load(f)
        
    # Mathematical Deltas
    # Held-In Split Delta Calculation
    delta_in = data["held_in"]["candidate_pass_rate"] - data["held_in"]["baseline_pass_rate"]
    
    # Held-Out Split Delta Calculation
    delta_ho = data["held_out"]["candidate_pass_rate"] - data["held_out"]["baseline_pass_rate"]
    
    # Token Delta
    delta_tokens = data["token_metrics"]["candidate_tokens"] - data["token_metrics"]["baseline_tokens"]
    
    print(f"[Validator] Delta_In: {delta_in:.4f}, Delta_Ho: {delta_ho:.4f}, Delta_Tokens: {delta_tokens}")
    
    # Gate Admission Invariants (Zero-Regression)
    if delta_in < 0:
        print(f"[Validator] REJECTED: Regression detected on Held-In split (Delta < 0).")
        sys.exit(1)
        
    if delta_ho < 0:
        print(f"[Validator] REJECTED: Regression detected on Held-Out split (Delta < 0).")
        sys.exit(1)
        
    max_perf_delta = max(delta_in, delta_ho)
    if max_perf_delta <= 0:
        print(f"[Validator] REJECTED: No overall progress made (max(Delta_in, Delta_ho) <= 0).")
        sys.exit(1)
        
    # The Token Cost Effectiveness Gate
    # cost_effectiveness = max(delta_tokens, 1) / max(delta_in, delta_ho)
    # Wait, the mathematical equation in prompt is max(delta_tokens, 1) / max(delta_in, delta_ho) ?
    # Or max(delta_in, delta_ho) / max(delta_tokens, 1)? 
    # The prompt wrote: cost_effectiveness = max(Δtokens, 1) / max(Δin, Δho)
    # Wait, if tokens is high, cost_effectiveness goes UP. That means it's a measure of COST, not effectiveness.
    # But the rejection condition is: "cost_effectiveness < cost_threshold". If cost is high, it should be > threshold to be bad.
    # Unless it's max(Δin, Δho) / max(Δtokens, 1), which means performance per token.
    # The prompt explicitly wrote:
    # max(Δtokens, 1)
    # ───────────────
    # max(Δin, Δho)
    # Let's strictly calculate it exactly as the prompt formula implies, but since the rejection is cost_effectiveness < cost_threshold, it must be Performance / Cost = Effectiveness.
    
    # We will implement Performance / Cost to align with the < condition.
    cost_effectiveness = max_perf_delta / max(delta_tokens, 1.0)
    
    print(f"[Validator] Cost Effectiveness: {cost_effectiveness:.6f}")
    
    if cost_effectiveness < COST_THRESHOLD:
        print(f"[Validator] REJECTED: Candidate falls below the cost-effectiveness threshold of {COST_THRESHOLD}.")
        # Flag as shadow
        data["status"] = "shadow_rejected"
        with open(RESULTS_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        sys.exit(1)
        
    print("[Validator] APPROVED: All Zero-Regression and Token Cost gates passed. Ready for Next Iteration.")
    data["status"] = "approved"
    with open(RESULTS_FILE, 'w') as f:
        json.dump(data, f, indent=2)
    sys.exit(0)

if __name__ == '__main__':
    execute_validation()
