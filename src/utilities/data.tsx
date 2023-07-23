// Clamp an input between low and high number values
export function clamp(value:number, min:number, max:number) {
	if (value > max) {
		console.debug('Input ', value, ' higher than ', max);
		return max;
	}
	else if (value < min) {
		console.debug('Input ', value, ' higher than ', max);
		return min;
	}
        
	return value;
}