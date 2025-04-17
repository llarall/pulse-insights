(function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const loading = document.getElementById('loading');
    const output = document.getElementById('output');
    let currentSort = {
        column: null,
        ascending: true
    };

    function calculateRanks(data) {
        const pairs = data
            .map((value, index) => ({ value: value?.median, index }))
            .filter(pair => pair.value !== null && pair.value !== undefined);
        
        pairs.sort((a, b) => b.value - a.value);
        
        const ranks = new Array(data.length).fill(null);
        pairs.forEach((pair, index) => {
            ranks[pair.index] = index + 1;
        });
        
        return ranks;
    }

    async function processData(data) {
        // Get course information
        const getFirstValue = (data, columnName) => {
            const request = {
                operationType: 'first value in column',
                data: data,
                options: {
                    columnIdentifier: columnName,
                    includeHeader: false
                }
            };
            const result = ArrayService.processRequest(request);
            return result.success ? result.result : '';
        };

        const subject = getFirstValue(data, 'Subject');
        const number = getFirstValue(data, 'Number');
        const courseName = getFirstValue(data, 'Course Name');
        const term = getFirstValue(data, 'Term');
        const firstName = getFirstValue(data, 'First Name');
        const lastName = getFirstValue(data, 'Last Name');

        const courseInfo = {
            course: `${subject}${number}: ${courseName}`,
            term: term,
            instructor: `${firstName} ${lastName}`.trim()
        };

        const repRowRequest = {
            operationType: 'column to row',
            data: data,
            options: {
                columnIdentifier: 'Students like me are REPRESENTED in my engineering major/minor.',
            }
        };

        const repRowResult = ArrayService.processRequest(repRowRequest);

        if (!repRowResult.success) {
            throw new Error('Failed to convert column to row: ' + repRowResult.error);
        }

        const repMedianResult = MathService.processRequest({
            calculationType: 'interpolated median',
            data: repRowResult.result,
            options: {
                allowedNumbers: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0]
            }
        });
        
        const repMedian = repMedianResult.result;

        const lowRepRequest = {
            operationType: 'extract rows',
            data: data,
            options: {
                columnIdentifier: 'Students like me are REPRESENTED in my engineering major/minor.',
                valueLEQThan: repMedian,
                valueGreaterThan: 0,
                includeHeaders: true
            }
        };
        const lowRepResult = ArrayService.processRequest(lowRepRequest);
        if (!lowRepResult.success) {
            throw new Error('Failed to extract low representation rows: ' + lowRepResult.error);
        }
        const lowRepRows = lowRepResult.result;

        const highRepRequest = {
            operationType: 'extract rows',
            data: data,
            options: {
                columnIdentifier: 'Students like me are REPRESENTED in my engineering major/minor.',
                valueGreaterThan: repMedian,
                valueLEQThan: 6,
                includeHeaders: true
            }
        };
        const highRepResult = ArrayService.processRequest(highRepRequest);
        if (!highRepResult.success) {
            throw new Error('Failed to extract high representation rows: ' + highRepResult.error);
        }
        const highRepRows = highRepResult.result;

        const extractColumns = (inputData) => {
            const extractRequest = {
                operationType: 'extract columns',
                data: inputData,
                options: {
                    containsValues: true,
                    columnIdentifiers: ['1.0', '2.0', '3.0', '4.0', '5.0', '6.0'],
                    includeHeaders: true
                }
            };

            const extractResult = ArrayService.processRequest(extractRequest);
            if (!extractResult.success) {
                throw new Error('Failed to extract columns: ' + extractResult.error);
            }

            const headers = extractResult.result[0];
            return headers.map((header, index) => {
                const columnData = extractResult.result.slice(1).map(row => row[index]);
                
                const medianResult = MathService.processRequest({
                    calculationType: 'interpolated median',
                    data: columnData,
                    options: {
                        allowedNumbers: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0]
                    }
                });

                return {
                    header,
                    median: medianResult.result,
                    n: medianResult.n
                };
            });
        };

        const fullData = extractColumns(data);
        const lowRepData = extractColumns(lowRepRows);
        const highRepData = extractColumns(highRepRows);

        const fullRanks = calculateRanks(fullData);
        const lowRepRanks = calculateRanks(lowRepData);
        const highRepRanks = calculateRanks(highRepData);

        return {
            courseInfo,
            fullData,
            lowRepData,
            highRepData,
            fullRanks,
            lowRepRanks,
            highRepRanks
        };
    }

    function sortTable(table, columnIndex) {
        if (currentSort.column === columnIndex) {
            currentSort.ascending = !currentSort.ascending;
        } else {
            currentSort.column = columnIndex;
            currentSort.ascending = true;
        }

        const rows = Array.from(table.querySelectorAll('tr')).slice(1);
        const sortedRows = rows.sort((a, b) => {
            const aCol = a.children[columnIndex].textContent;
            const bCol = b.children[columnIndex].textContent;
            
            if (aCol === 'N/A' && bCol === 'N/A') return 0;
            if (aCol === 'N/A') return 1;
            if (bCol === 'N/A') return -1;
            
            const aValue = isNaN(parseFloat(aCol)) ? aCol : parseFloat(aCol);
            const bValue = isNaN(parseFloat(bCol)) ? bCol : parseFloat(bCol);
            
            if (typeof aValue === 'string') {
                return currentSort.ascending ? 
                    aValue.localeCompare(bValue) : 
                    bValue.localeCompare(aValue);
            } else {
                return currentSort.ascending ? 
                    aValue - bValue : 
                    bValue - aValue;
            }
        });

        // Update sort indicators
        const headers = table.querySelectorAll('th');
        headers.forEach((header, i) => {
            header.classList.remove('sorted-asc', 'sorted-desc');
            if (i === columnIndex) {
                header.classList.add(currentSort.ascending ? 'sorted-asc' : 'sorted-desc');
            }
        });

        // Reorder rows
        const tbody = table.querySelector('tbody') || table;
        sortedRows.forEach(row => tbody.appendChild(row));
    }

    function displayResults(results) {
        output.innerHTML = '';

        // Calculate analysis metrics
        let lowRepLessCount = 0;
        let highRepLessCount = 0;
        let equalCount = 0;
        const medianDiffs = [];
        const rankDiffs = [];
        let lowRepSum = 0;
        let highRepSum = 0;
        let validPairCount = 0;

        results.fullData.forEach((fullResult, index) => {
            const lowRepMedian = results.lowRepData[index].median;
            const highRepMedian = results.highRepData[index].median;
            const lowRepRank = results.lowRepRanks[index];
            const highRepRank = results.highRepRanks[index];

            if (lowRepMedian && highRepMedian) {
                if (lowRepMedian < highRepMedian) lowRepLessCount++;
                if (highRepMedian < lowRepMedian) highRepLessCount++;
                if (lowRepMedian === highRepMedian) equalCount++;

                const diff = Math.abs(highRepMedian - lowRepMedian);
                // Store difference and question for sorting later
                medianDiffs.push({
                    question: fullResult.header,
                    diff: diff,
                    lowRepMedian,
                    highRepMedian
                });

                lowRepSum += lowRepMedian;
                highRepSum += highRepMedian;
                validPairCount++;
            }

            if (lowRepRank && highRepRank) {
                const rankDiff = Math.abs(highRepRank - lowRepRank);
                // Store rank difference and question for sorting later
                rankDiffs.push({
                    question: fullResult.header,
                    diff: rankDiff,
                    lowRepRank,
                    highRepRank
                });
            }
        });

        // Sort differences to find top 2
        medianDiffs.sort((a, b) => b.diff - a.diff);
        rankDiffs.sort((a, b) => b.diff - a.diff);

        const topTwoMedianDiffs = medianDiffs.slice(0, 2);
        const topTwoRankDiffs = rankDiffs.slice(0, 2);

        const analysisHtml = `
            <div class="analysis-section">
                <h2>Analysis</h2>
                <p><em>Notes: </em><strong>"LowRep"</strong> refers to less represented students (responses below or at the median for "Students like me are REPRESENTED in my engineering major/minor"). <strong>"HighRep"</strong> refers to more represented students (responses above the median). <strong>"Median" refers to the interpolated median</strong>, which is used by the SLE. <strong>Maximum median is 6.0</strong> (Strongly Agree).</p>
                <p><strong>In your results...</strong></p>
                <ul>
                    <li>LowRep students responded less favorably than HighRep students for <strong>${((lowRepLessCount / validPairCount) * 100).toFixed(2)}%</strong> of the questions.</li>
                    <li>HighRep students responded less favorably than LowRep students for <strong>${((highRepLessCount / validPairCount) * 100).toFixed(2)}%</strong> of the questions.</li>
                    <li>LowRep and HighRep students responded the same for <strong>${((equalCount / validPairCount) * 100).toFixed(2)}%</strong> of the questions.</li>
                    <li>Top questions where LowRep and HighRep medians are farthest apart:
                        <ul>
                            <li><strong>"${topTwoMedianDiffs[0].question}"</strong> with a difference of <strong>${topTwoMedianDiffs[0].diff.toFixed(2)}</strong> (LowRep: <strong>${topTwoMedianDiffs[0].lowRepMedian.toFixed(2)}</strong>, HighRep: <strong>${topTwoMedianDiffs[0].highRepMedian.toFixed(2)}</strong>)</li>
                            <li><strong>"${topTwoMedianDiffs[1].question}"</strong> with a difference of <strong>${topTwoMedianDiffs[1].diff.toFixed(2)}</strong> (LowRep: <strong>${topTwoMedianDiffs[1].lowRepMedian.toFixed(2)}</strong>, HighRep: <strong>${topTwoMedianDiffs[1].highRepMedian.toFixed(2)}</strong>)</li>
                        </ul>
                    </li>
                    <li>Top questions where LowRep and HighRep ranks are farthest apart:
                        <ul>
                            <li><strong>"${topTwoRankDiffs[0].question}"</strong> with a rank difference of <strong>${topTwoRankDiffs[0].diff}</strong> (LowRep rank: <strong>${topTwoRankDiffs[0].lowRepRank}</strong>, HighRep rank: <strong>${topTwoRankDiffs[0].highRepRank}</strong>)</li>
                            <li><strong>"${topTwoRankDiffs[1].question}"</strong> with a rank difference of <strong>${topTwoRankDiffs[1].diff}</strong> (LowRep rank: <strong>${topTwoRankDiffs[1].lowRepRank}</strong>, HighRep rank: <strong>${topTwoRankDiffs[1].highRepRank}</strong>)</li>
                        </ul>
                    </li>
                    <li>The average median for LowRep is <strong>${(lowRepSum / validPairCount).toFixed(2)}</strong>.</li>
                    <li>The average median for HighRep is <strong>${(highRepSum / validPairCount).toFixed(2)}</strong>.</li>
                </ul>
                <h2 id="what-now">What should I do based on these data?</h2>
                <p>If there are big differences between how your LowRep and HighRep students responded, consider where the largest gaps are and how you might address them. Contact the <a href="mailto:eecs-teaching@oregonstate.edu">EECS Effective &amp; Inclusive Teaching Practice Committee</a> or the <a href="https://ctl.oregonstate.edu/" target="_blank">Center for Teaching and Learning</a> for ideas. Then, re-run this analysis for a future term to determine whether your change might have helped. Remember to <a href="https://docs.google.com/document/d/e/2PACX-1vRCVPhvZkmnl1D7D8-wKyMDNJTqiagvtlPJrxWiwhbTctoex1eJbPuMWqcZJ6VF90yTuqwvrhxRp67J/pub" target="_blank">use the PULSE questions</a> each term.<p>
            </div>
        `;

        // Create course info section first
        const courseInfoSection = document.createElement('div');
        courseInfoSection.className = 'course-info-section';
        courseInfoSection.innerHTML = `
            <h2>Course Information</h2>
            <table>
                <tr>
                    <th>Course</th>
                    <td>${results.courseInfo.course}</td>
                </tr>
                <tr>
                    <th>Term</th>
                    <td>${results.courseInfo.term}</td>
                </tr>
                <tr>
                    <th>Instructor</th>
                    <td>${results.courseInfo.instructor}</td>
                </tr>
            </table>
        `;
        output.appendChild(courseInfoSection);

        // Then add analysis section
        output.innerHTML += analysisHtml;

        const title = document.createElement('h2');
        title.className = 'table-title';
        title.textContent = 'Full Results';
        output.appendChild(title);

        const sortingInfo = document.createElement('p');
        sortingInfo.className = 'sorting-instructions';
        sortingInfo.textContent = 'Sort by clicking a any column heading.';
        output.appendChild(sortingInfo);

        const table = document.createElement('table');
        
        const headerRow = document.createElement('tr');
        ['Question', 'Median', 'LowRep Median', 'HighRep Median', 'n', 'LowRep n', 'HighRep n', 'Rank', 'LowRep Rank', 'HighRep Rank'].forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        results.fullData.forEach((fullResult, index) => {
            const lowRepResult = results.lowRepData[index];
            const highRepResult = results.highRepData[index];
            const tr = document.createElement('tr');
            
            const tdHeader = document.createElement('td');
            const isPulseQuestion = [
                'Students like me are REPRESENTED in my engineering major/minor.',
                'This course helped me believe I can SUCCEED in an engineering field.',
                'Because of this course, I feel more likely to COMPLETE an engineering major/minor.',
                'Because of this course, I feel more like I BELONG in an engineering major/minor.',
                'Because of this course, I feel more SATISFIED with my engineering major/minor.'
            ].includes(fullResult.header);
            tdHeader.textContent = isPulseQuestion ? '🧡 ' + fullResult.header : fullResult.header;
            tr.appendChild(tdHeader);



// Highlight low numbers.    

            function getColorClass(value) {
                if (typeof value !== 'number' || isNaN(value)) return ''; // No class for non-numeric values
                if (value <= 5) return 'low-value';
                if (value <= 6) return 'medium-value';
                return 'high-value';
            }
            function createCell(value, isNumeric = false) {
                const td = document.createElement('td');
                td.textContent = isNumeric && typeof value === 'number' ? value.toFixed(2) : value || 'N/A';

                if (isNumeric) {
                    const colorClass = getColorClass(value);
                    if (colorClass) td.classList.add(colorClass);
                }

                return td;
            }

            const tdMedian = document.createElement('td');
            tdMedian.textContent = fullResult.median ? fullResult.median.toFixed(2) : 'N/A';
            // tr.appendChild(tdMedian);
            tr.appendChild(createCell(fullResult.median, true));
            
            const tdLowRepMedian = document.createElement('td');
            tdLowRepMedian.textContent = lowRepResult.median ? lowRepResult.median.toFixed(2) : 'N/A';
            // tr.appendChild(tdLowRepMedian);
            tr.appendChild(createCell(lowRepResult.median, true));

            const tdHighRepMedian = document.createElement('td');
            tdHighRepMedian.textContent = highRepResult.median ? highRepResult.median.toFixed(2) : 'N/A';
            // tr.appendChild(tdHighRepMedian);
            tr.appendChild(createCell(highRepResult.median, true));

            const tdN = document.createElement('td');
            tdN.textContent = Math.round(fullResult.n);
            // tr.appendChild(tdN);
            tr.appendChild(createCell(Math.round(fullResult.n)));

            const tdLowRepN = document.createElement('td');
            tdLowRepN.textContent = Math.round(lowRepResult.n);
            // tr.appendChild(tdLowRepN);
            tr.appendChild(createCell(Math.round(lowRepResult.n)));

            const tdHighRepN = document.createElement('td');
            tdHighRepN.textContent = Math.round(highRepResult.n);
            // tr.appendChild(tdHighRepN);
            tr.appendChild(createCell(Math.round(highRepResult.n)));

            const tdRank = document.createElement('td');
            tdRank.textContent = results.fullRanks[index] || 'N/A';
            // tr.appendChild(tdRank);
            tr.appendChild(createCell(results.fullRanks[index]));

            const tdLowRepRank = document.createElement('td');
            tdLowRepRank.textContent = results.lowRepRanks[index] || 'N/A';
            // tr.appendChild(tdLowRepRank);
            tr.appendChild(createCell(results.lowRepRanks[index]));

            const tdHighRepRank = document.createElement('td');
            tdHighRepRank.textContent = results.highRepRanks[index] || 'N/A';
            // tr.appendChild(tdHighRepRank);
            tr.appendChild(createCell(results.highRepRanks[index]));

            table.appendChild(tr);
        });

        // Add click handlers to headers
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            header.addEventListener('click', () => sortTable(table, index));
        });

        output.appendChild(table);
    }

    async function handleFile(file) {
        loading.style.display = 'block';
        output.innerHTML = '';

        try {
            const arrayBuffer = await file.arrayBuffer();
            const fileRequest = {
                operationType: "xlsx to array",
                fileData: arrayBuffer
            };

            const fileResult = await FileService.processRequest(fileRequest);
            if (!fileResult.success) {
                throw new Error(fileResult.error);
            }

            const results = await processData(fileResult.result);
            displayResults(results);
        } catch (error) {
            output.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        } finally {
            loading.style.display = 'none';
        }
    }

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', e => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });
    dropZone.addEventListener('dragover', e => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length && files[0].name.match(/\.(xlsx|xls)$/)) {
            handleFile(files[0]);
        }
    });
})();

document.getElementById('learnMore').addEventListener('click', function() {
    const content = document.querySelector('.more-content');
    const isHidden = content.style.display === 'none';
    content.style.display = isHidden ? 'block' : 'none';
    this.textContent = isHidden ? 'Show Less' : 'Show More About this Tool';
});

document.getElementById('show-instructions').addEventListener('click', function() {
    const content = document.querySelector('.more-step1-content');
    const isHidden = content.style.display === 'none';
    content.style.display = isHidden ? 'block' : 'none';
    this.textContent = isHidden ? 'Hide Instructions' : 'Show Instructions';
});