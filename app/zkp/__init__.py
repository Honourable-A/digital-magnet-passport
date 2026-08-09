# server-side ZKP via Node subprocess — superseded by client-side snarkjs (zkp_queue.html)
# recycled_gt20 circuit; prove_and_verify_recycled is no longer called

# import subprocess
# import json
# import tempfile
# import shutil
# import os

# _here = os.path.dirname(__file__)
# _project_root = os.path.dirname(os.path.dirname(_here))
# _workspace = os.path.join(_project_root, "zkp", "recycled_gt20", "outputs")

# VERIFICATION_KEY = os.path.join(_here, "keys", "verification_key.json")
# WASM = os.path.join(_workspace, "recycled_gt20_js", "recycled_gt20.wasm")
# GENERATE_WITNESS_JS = os.path.join(_workspace, "recycled_gt20_js", "generate_witness.js")
# ZKEY = os.path.join(_workspace, "recycled_gt20_0000.zkey")

# def prove_and_verify_recycled(recycled_content: float, threshold: float) -> bool:
#     recycled_scaled = int(recycled_content * 10)
#     threshold_scaled = int(threshold * 10)
#     work_dir = tempfile.mkdtemp()
#     try:
#         input_path = os.path.join(work_dir, "input.json")
#         witness_path = os.path.join(work_dir, "witness.wtns")
#         proof_path = os.path.join(work_dir, "proof.json")
#         public_path = os.path.join(work_dir, "public.json")
#         with open(input_path, 'w') as f:
#             json.dump({"recycled_scaled": recycled_scaled, "threshold_scaled": threshold_scaled}, f)
#         subprocess.run(
#             ["node", GENERATE_WITNESS_JS, WASM, input_path, witness_path],
#             check=True, capture_output=True
#         )
#         subprocess.run(
#             ["snarkjs", "groth16", "prove", ZKEY, witness_path, proof_path, public_path],
#             check=True, capture_output=True
#         )
#         verify = subprocess.run(
#             ["snarkjs", "groth16", "verify", VERIFICATION_KEY, public_path, proof_path],
#             capture_output=True, text=True
#         )
#         if "OK" not in verify.stdout:
#             return False
#         with open(public_path) as f:
#             public_signals = json.load(f)
#         return public_signals[0] == "1"
#     finally:
#         shutil.rmtree(work_dir, ignore_errors=True)
