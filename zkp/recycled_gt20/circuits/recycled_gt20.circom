pragma circom 2.2.3;

include "../node_modules/circomlib/circuits/comparators.circom";

// Todo: currently the decimal point is 1 place so multiplying by 10: 23.4 becomes 234 | check the extent of decimal precision... 
template RecycledGTx() {
    signal input recycled_scaled;
    signal input threshold_scaled;
    signal output meets_threshold;

    component gt = GreaterThan(10); // defining the bit width 2^10 > 1000
    gt.in[0] <== recycled_scaled;
    gt.in[1] <== threshold_scaled;
    meets_threshold <== gt.out;
}

component main {public [threshold_scaled]} = RecycledGTx();
