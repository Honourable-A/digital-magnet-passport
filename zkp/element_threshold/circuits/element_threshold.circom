pragma circom 2.2.3;

include "circomlib/circuits/comparators.circom";

// Proves that value_scaled satisfies the stated threshold without revealing value_scaled.
// value_scaled: private — actual element percentage * 10 (e.g. 32.5% → 325)
// threshold_scaled: public — recycler's threshold * 10
// is_gt: public — 1 means claim is "value > threshold", 0 means "value < threshold"
// result: 1 if the claim is satisfied, 0 otherwise
template ElementThreshold() {
    signal input value_scaled;
    signal input threshold_scaled;
    signal input is_gt;
    signal output result;

    component gt = GreaterThan(10);
    gt.in[0] <== value_scaled;
    gt.in[1] <== threshold_scaled;

    component lt = LessThan(10);
    lt.in[0] <== value_scaled;
    lt.in[1] <== threshold_scaled;

    signal gt_branch <== is_gt * gt.out;
    signal lt_branch <== (1 - is_gt) * lt.out;
    result <== gt_branch + lt_branch;
}

component main {public [threshold_scaled, is_gt]} = ElementThreshold();
