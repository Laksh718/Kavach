def compute_deviation_factor(worker_avg, predicted_avg):
    if predicted_avg == 0:
        return 1.0
    return worker_avg / predicted_avg

def adjust_prediction(predicted, deviation):
    return predicted * deviation
