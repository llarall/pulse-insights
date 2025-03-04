var MathService = (function() {
    function _calculateInterpolatedMedian(data, options = {}) {
        var validData = data.filter(function(item) {
            // Convert string numbers to numbers
            var num = typeof item === 'string' ? parseFloat(item) : item;
            if (isNaN(num)) return false;
            
            var isValid = true;
            if (options.allowedNumberRange) {
                isValid = isValid && num >= options.allowedNumberRange[0] && num <= options.allowedNumberRange[1];
            }
            if (options.allowedNumbers) {
                isValid = isValid && options.allowedNumbers.includes(num);
            }
            return isValid;
        }).map(item => typeof item === 'string' ? parseFloat(item) : item);
        
        if (validData.length === 0) return null;
        
        validData.sort((a, b) => a - b);
        
        var midIndex = Math.floor(validData.length / 2);
        var M = validData.length % 2 === 0 ? 
            (validData[midIndex - 1] + validData[midIndex]) / 2 : 
            validData[midIndex];
        
        var nl = 0, ne = 0, ng = 0;
        validData.forEach(num => {
            if (num < M) nl++;
            else if (num === M) ne++;
            else ng++;
        });
        
        return ne !== 0 ? M + (ng - nl) / (2 * ne) : M;
    }
    
    return {
        processRequest: function(request) {
            try {
                if (!request.calculationType || !request.data) {
                    return {
                        success: false,
                        calculationType: request.calculationType || 'unknown',
                        result: null,
                        n: 0,
                        error: 'Missing required parameters'
                    };
                }
                
                if (!Array.isArray(request.data)) {
                    return {
                        success: false,
                        calculationType: request.calculationType,
                        result: null,
                        n: 0,
                        error: 'Data must be an array'
                    };
                }
                
                switch(request.calculationType.toLowerCase()) {
                    case 'interpolated median':
                        var validData = request.data.filter(function(item) {
                            var num = typeof item === 'string' ? parseFloat(item) : item;
                            if (isNaN(num)) return false;
                            
                            var isValid = true;
                            if (request.options && request.options.allowedNumberRange) {
                                isValid = isValid && num >= request.options.allowedNumberRange[0] && num <= request.options.allowedNumberRange[1];
                            }
                            if (request.options && request.options.allowedNumbers) {
                                isValid = isValid && request.options.allowedNumbers.includes(num);
                            }
                            return isValid;
                        });
                        
                        var result = _calculateInterpolatedMedian(
                            request.data,
                            request.options || {}
                        );
                        
                        return {
                            success: result !== null,
                            calculationType: 'interpolated median',
                            result: result,
                            n: validData.length,
                            error: result === null ? 'No valid data points after filtering' : null
                        };
                        
                    default:
                        return {
                            success: false,
                            calculationType: request.calculationType,
                            result: null,
                            n: 0,
                            error: 'Unsupported calculation type'
                        };
                }
                
            } catch (error) {
                return {
                    success: false,
                    calculationType: request.calculationType || 'unknown',
                    result: null,
                    n: 0,
                    error: error.message
                };
            }
        }
    };
})();