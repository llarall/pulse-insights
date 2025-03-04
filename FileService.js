var FileService = (function() {
    async function _convertXLSXToArray(fileData) {
        try {
            const workbook = XLSX.read(fileData, {
                cellStyles: true,
                cellFormulas: true,
                cellDates: true,
                cellNF: true,
                sheetStubs: true
            });

            let masterHeaders = [];
            let firstSheet = true;
            let combinedData = [];

            workbook.SheetNames.forEach(sheetName => {
                const worksheet = workbook.Sheets[sheetName];
                const sheetData = XLSX.utils.sheet_to_json(worksheet, {
                    header: 1,
                    defval: null,
                    raw: false
                });

                if (!sheetData.length) return;

                const currentHeaders = sheetData[0]?.map(h => h?.toString().trim()) || [];
                
                if (firstSheet) {
                    masterHeaders = currentHeaders;
                    combinedData = sheetData;
                    firstSheet = false;
                } else {
                    // Find new headers not in master list
                    const newHeaders = currentHeaders.filter(h => h && !masterHeaders.includes(h));
                    masterHeaders.push(...newHeaders);

                    // Create header mapping
                    const headerMap = currentHeaders.map(header => 
                        header ? masterHeaders.indexOf(header) : -1
                    );

                    // Map data rows to master headers
                    const dataRows = sheetData.slice(1);
                    dataRows.forEach(row => {
                        if (!Array.isArray(row)) return;
                        
                        const newRow = new Array(masterHeaders.length).fill(null);
                        headerMap.forEach((targetIndex, srcIndex) => {
                            if (targetIndex !== -1 && row[srcIndex] !== undefined) {
                                newRow[targetIndex] = row[srcIndex];
                            }
                        });
                        combinedData.push(newRow);
                    });
                }
            });
            return combinedData;
        } catch (error) {
            throw new Error('Failed to convert XLSX to array: ' + error.message);
        }
    }
    
    return {
        processRequest: async function(request) {
            try {
                if (!request.operationType || !request.fileData) {
                    return {
                        success: false,
                        operationType: request.operationType || 'unknown',
                        result: null,
                        error: 'Missing required parameters'
                    };
                }
                
                switch(request.operationType.toLowerCase()) {
                    case 'xlsx to array':
                        try {
                            const result = await _convertXLSXToArray(request.fileData);
                            return {
                                success: true,
                                operationType: 'xlsx to array',
                                result: result,
                                error: null
                            };
                        } catch (error) {
                            return {
                                success: false,
                                operationType: 'xlsx to array',
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