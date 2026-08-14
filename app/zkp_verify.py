import json
import subprocess
import tempfile
import os
from pathlib import Path

_NODE = "node"
_SNARKJS = str(Path.home() / ".nvm/versions/node/v24.15.0/lib/node_modules/snarkjs/main.js")

_VERIFY_SCRIPT = """
const snarkjs = require(process.argv[2]);
const vk      = JSON.parse(require("fs").readFileSync(process.argv[3]));
const pub     = JSON.parse(require("fs").readFileSync(process.argv[4]));
const proof   = JSON.parse(require("fs").readFileSync(process.argv[5]));
snarkjs.groth16.verify(vk, pub, proof).then(ok => {
    process.stdout.write(ok ? "true" : "false");
    process.exit(0);
}).catch(() => {
    process.stdout.write("error");
    process.exit(1);
});
"""


def verify_groth16(vk: dict, public_signals: list, proof: dict) -> bool:
    try:
        with tempfile.TemporaryDirectory() as tmp:
            script = os.path.join(tmp, "verify.js")
            vk_f   = os.path.join(tmp, "vk.json")
            pub_f  = os.path.join(tmp, "pub.json")
            proof_f = os.path.join(tmp, "proof.json")

            open(script,  "w").write(_VERIFY_SCRIPT)
            json.dump(vk,             open(vk_f,    "w"))
            json.dump(public_signals, open(pub_f,   "w"))
            json.dump(proof,          open(proof_f, "w"))

            result = subprocess.run(
                [_NODE, script, _SNARKJS, vk_f, pub_f, proof_f],
                capture_output=True, text=True, timeout=30
            )
            return result.stdout.strip() == "true"
    except Exception:
        return False
