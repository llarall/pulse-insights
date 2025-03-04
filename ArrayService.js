var ArrayService = (function() {
    function _extractColumns(data, options = {}) {
        try {
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Input must be a non-empty array');
            }

            const { columnIdentifiers, includeHeaders = false, containsValues = false } = options;
            if (!Array.isArray(columnIdentifiers) || columnIdentifiers.length === 0) {
                throw new Error('Column identifiers must be a non-empty array');
            }

            const result = [];
            const headers = data[0];
            let columnIndexes = [];

            if (containsValues) {
                columnIndexes = headers.map((_, index) => index).filter(colIndex => {
                    const colValues = data.slice(1).map(row => row[colIndex]);
                    return columnIdentifiers.some(value => 
                        colValues.some(colValue => 
                            colValue !== undefined && 
                            colValue !== null && 
                            colValue.toString().toLowerCase() === value.toString().toLowerCase()
                        )
                    );
                });
            } else {
                columnIndexes = columnIdentifiers.map(identifier => {
                    if (typeof identifier === 'number') {
                        return identifier;
                    } else if (typeof identifier === 'string') {
                        const index = headers.findIndex(header => 
                            header.toString().toLowerCase() === identifier.toString().toLowerCase()
                        );
                        if (index === -1) {
                            throw new Error(`Column "${identifier}" not found in headers`);
                        }
                        return index;
                    } else {
                        throw new Error('Column identifiers must be numbers or strings');
                    }
                });
            }

            const startIndex = includeHeaders ? 0 : 1;
            for (let i = startIndex; i < data.length; i++) {
                const row = data[i];
                if (Array.isArray(row)) {
                    result.push(columnIndexes.map(index => 
                        index < row.length ? row[index] : undefined
                    ));
                }
            }

            return result;
        } catch (error) {
            throw error;
        }
    }

    function _columnToRow(data, options = {}) {
        try {
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Input must be a non-empty array');
            }

            const { columnIdentifier, includeHeader = false } = options;
            if (columnIdentifier === undefined) {
                throw new Error('Column identifier must be provided');
            }

            const headers = data[0];
            let columnIndex;

            if (typeof columnIdentifier === 'number') {
                columnIndex = columnIdentifier;
            } else if (typeof columnIdentifier === 'string') {
                columnIndex = headers.findIndex(header => 
                    header.toString().toLowerCase() === columnIdentifier.toString().toLowerCase()
                );
                if (columnIndex === -1) {
                    throw new Error(`Column "${columnIdentifier}" not found in headers`);
                }
            } else {
                throw new Error('Column identifier must be either a number or string');
            }

            const result = data.slice(1).map(row => 
                Array.isArray(row) && columnIndex < row.length ? row[columnIndex] : undefined
            );

            return includeHeader ? [headers[columnIndex], ...result] : result;
        } catch (error) {
            throw error;
        }
    }

    function _extractRowsByColumn(data, options = {}) {
        try {
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Input must be a non-empty array');
            }

            const { 
                columnIdentifier, 
                value, 
                valueGreaterThan, 
                valueLessThan,
                valueGEQThan,
                valueLEQThan,
                includeHeaders = false 
            } = options;

            if (columnIdentifier === undefined || 
                (value === undefined && 
                 valueGreaterThan === undefined && 
                 valueLessThan === undefined &&
                 valueGEQThan === undefined &&
                 valueLEQThan === undefined)) {
                throw new Error('Column identifier and at least one value constraint must be provided');
            }

            let columnIndex;
            if (typeof columnIdentifier === 'number') {
                columnIndex = columnIdentifier;
            } else if (typeof columnIdentifier === 'string') {
                const headers = data[0];
                columnIndex = headers.findIndex(header => 
                    header.toString().toLowerCase() === columnIdentifier.toString().toLowerCase()
                );
                if (columnIndex === -1) {
                    throw new Error(`Column "${columnIdentifier}" not found in headers`);
                }
            } else {
                throw new Error('Column identifier must be either a number or string');
            }

            let filteredData = data.filter((row, index) => {
                if (typeof columnIdentifier === 'string' && index === 0) return false;
                
                if (!Array.isArray(row) || columnIndex >= row.length) {
                    return false;
                }

                const cellValue = row[columnIndex];
                
                if (value !== undefined) {
                    return cellValue === value;
                }
                
                let matches = true;
                if (valueGreaterThan !== undefined) {
                    matches = matches && cellValue > valueGreaterThan;
                }
                if (valueLessThan !== undefined) {
                    matches = matches && cellValue < valueLessThan;
                }
                if (valueGEQThan !== undefined) {
                    matches = matches && cellValue >= valueGEQThan;
                }
                if (valueLEQThan !== undefined) {
                    matches = matches && cellValue <= valueLEQThan;
                }
                return matches;
            });

            if (includeHeaders && typeof columnIdentifier === 'string' && filteredData.length > 0) {
                filteredData.unshift(data[0]);
            }
            return filteredData;
        } catch (error) {
            throw error;
        }
    }

    function _getFirstValueInColumn(data, options = {}) {
        try {
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Input must be a non-empty array');
            }

            const { columnIdentifier, includeHeader = false } = options;
            if (columnIdentifier === undefined) {
                throw new Error('Column identifier must be provided');
            }

            const headers = data[0];
            let columnIndex;

            if (typeof columnIdentifier === 'number') {
                columnIndex = columnIdentifier;
            } else if (typeof columnIdentifier === 'string') {
                columnIndex = headers.findIndex(header => 
                    header.toString().toLowerCase() === columnIdentifier.toString().toLowerCase()
                );
                if (columnIndex === -1) {
                    throw new Error(`Column "${columnIdentifier}" not found in headers`);
                }
            } else {
                throw new Error('Column identifier must be either a number or string');
            }

            const startIndex = includeHeader ? 0 : 1;
            for (let i = startIndex; i < data.length; i++) {
                const row = data[i];
                if (Array.isArray(row) && columnIndex < row.length && row[columnIndex] !== undefined) {
                    return row[columnIndex];
                }
            }

            return null;
        } catch (error) {
            throw error;
        }
    }

    return {
        processRequest: function(request) {
            try {
                if (!request.operationType || !request.data) {
                    return {
                        success: false,
                        operationType: request.operationType || 'unknown',
                        result: null,
                        error: 'Missing required parameters'
                    };
                }

                switch(request.operationType.toLowerCase()) {
                    case 'extract columns':
                        try {
                            const result = _extractColumns(
                                request.data,
                                request.options || {}
                            );
                            return {
                                success: true,
                                operationType: 'extract columns',
                                result: result,
                                error: null
                            };
                        } catch (error) {
                            return {
                                success: false,
                                operationType: 'extract columns',
                                result: null,
                                error: error.message
                            };
                        }

                    case 'column to row':
                        try {
                            const result = _columnToRow(
                                request.data,
                                request.options || {}
                            );
                            return {
                                success: true,
                                operationType: 'column to row',
                                result: result,
                                error: null
                            };
                        } catch (error) {
                            return {
                                success: false,
                                operationType: 'column to row',
                                result: null,
                                error: error.message
                            };
                        }

                    case 'extract rows':
                        try {
                            const result = _extractRowsByColumn(
                                request.data,
                                request.options || {}
                            );
                            return {
                                success: true,
                                operationType: 'extract rows',
                                result: result,
                                error: null
                            };
                        } catch (error) {
                            return {
                                success: false,
                                operationType: 'extract rows',
                                result: null,
                                error: error.message
                            };
                        }

                    case 'first value in column':
                        try {
                            const result = _getFirstValueInColumn(
                                request.data,
                                request.options || {}
                            );
                            return {
                                success: true,
                                operationType: 'first value in column',
                                result: result,
                                error: null
                            };
                        } catch (error) {
                            return {
                                success: false,
                                operationType: 'first value in column',
                                result: null,
                                error: error.message
                            };
                        }

                    default:
                        return {
                            success: false,
                            operationType: request.operationType,
                            result: null,
                            error: 'Unsupported operation type'
                        };
                }
            } catch (error) {
                return {
                    success: false,
                    operationType: request.operationType || 'unknown',
                    result: null,
                    error: error.message
                };
            }
        }
    };
})();