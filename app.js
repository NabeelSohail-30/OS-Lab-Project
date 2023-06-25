function createInputFields() {
    const processes = document.querySelector("#numOfProcessors").value;
    const processesDiv = document.getElementById("processes");

    processesDiv.style.display = "flex";

    console.log(processes);

    if (processes > 0 && processes <= 10) {
        for (let i = 0; i < processes; i++) {
            const input = document.createElement("input");
            input.placeholder = `Burst Time for Process ${i + 1}`
            input.type = "number";
            processesDiv.appendChild(input);
            processesDiv.appendChild(document.createElement("br"));
        }
    } else {
        alert("Please enter a number between 1 and 10.");
        return;
    }

    const inputTQ = document.createElement("input");
    inputTQ.placeholder = "Time Quantum";
    inputTQ.id = "timeQuantum";
    inputTQ.type = "number";
    processesDiv.appendChild(inputTQ);
    processesDiv.appendChild(document.createElement("br"));

    const calculateBtn = document.createElement("button");
    calculateBtn.innerHTML = "Calculate";
    calculateBtn.classList = "btn";
    calculateBtn.onclick = () => {
        calculateRoundRobbin();
    };
    processesDiv.appendChild(calculateBtn);
    document.querySelector("#numOfProcessors").value = "";
}

function calculateRoundRobbin() {
    const processes = document.querySelectorAll("#processes input[type='number']");
    const timeQuantum = document.querySelector("#timeQuantum").value;

    const table = document.createElement("table");
    table.innerHTML = `
        <thead>
            <tr>
                <th>Process</th>
                <th>Arrival Time</th>
                <th>Burst Time</th>
                <th>Completion Time</th>
                <th>Turnaround Time</th>
                <th>Waiting Time</th>
            </tr>
        </thead>
        <tbody id="result-body"></tbody>
        <tfoot>
            <tr>
                <td colspan="2">Time Quantam</td>
                <td id="timeq">0</td>
                <td colspan="1">Average</td>
                <td id="avg-turnaround-time">0</td>
                <td id="avg-waiting-time">0</td>
            </tr>
        </tfoot>
    `;

    let totalTurnaroundTime = 0;
    let totalWaitTime = 0;

    const resultBody = table.querySelector("#result-body");

    for (let i = 0; i < processes.length - 1; i++) {
        const burstTime = parseInt(processes[i].value);
        const completionTime = burstTime * (Math.ceil(burstTime / timeQuantum));
        const turnaroundTime = completionTime;
        const waitTime = completionTime - burstTime;

        totalTurnaroundTime += turnaroundTime;
        totalWaitTime += waitTime;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>0</td>
            <td>${burstTime}</td>
            <td>${completionTime}</td>
            <td>${turnaroundTime}</td>
            <td>${waitTime}</td>
        `;
        resultBody.appendChild(row);
    }

    const avgTurnaroundTime = totalTurnaroundTime / processes.length;
    const avgWaitTime = totalWaitTime / processes.length;

    const avgTurnaroundTimeCell = table.querySelector("#avg-turnaround-time");
    const avgWaitTimeCell = table.querySelector("#avg-waiting-time");
    const timeq = table.querySelector("#timeq");

    avgTurnaroundTimeCell.textContent = avgTurnaroundTime;
    avgWaitTimeCell.textContent = avgWaitTime;
    timeq.textContent = timeQuantum;

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
    resultDiv.appendChild(table);

    const processDiv = document.getElementById("processes");
    processDiv.style.display = "none";
}

function resetRR() {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
    const processDiv = document.getElementById("processes");
    processDiv.innerHTML = "";
    processDiv.style.display = "none";
    const numOfProcessors = document.getElementById("numOfProcessors");
    numOfProcessors.value = "";
}

function createInputFieldsFF() {
    const numOfProcesses = document.querySelector("#numOfProcessors").value;
    const memoryBlocks = document.querySelector("#memoryBlocks").value;
    const inputDiv = document.getElementById("input");

    inputDiv.style.display = "flex";

    if (numOfProcesses > 0 && numOfProcesses <= 10) {
        for (let i = 0; i < numOfProcesses; i++) {
            const input = document.createElement("input");
            input.placeholder = `Process Size for Process ${i + 1}`;
            input.type = "number";
            input.classList = "process";
            inputDiv.appendChild(input);
            inputDiv.appendChild(document.createElement("br"));
        }
    } else {
        alert("Number of Processes must be between 1 and 10");
        return;
    }

    if (memoryBlocks > 1) {
        for (let i = 0; i < memoryBlocks; i++) {
            const inputBlock = document.createElement("input");
            inputBlock.placeholder = `Memory Size for Block ${i + 1}`;
            inputBlock.type = "number";
            inputBlock.classList = "block";
            inputDiv.appendChild(inputBlock);
            inputDiv.appendChild(document.createElement("br"));
        }
    }

    const calculateBtn = document.createElement("button");
    calculateBtn.innerHTML = "Calculate";
    calculateBtn.classList = "btn";
    calculateBtn.onclick = () => {
        calculateFirstFit();
    };
    inputDiv.appendChild(calculateBtn);
    document.querySelector("#numOfProcessors").value = "";
    document.querySelector("#memoryBlocks").value = "";
}

function calculateFirstFit() {
    const processes = document.querySelectorAll("#input .process");
    const blocks = document.querySelectorAll("#input .block");

    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>Process No.</th>
          <th>Process Size</th>
          <th>Allocated Block Size</th>
          <th>Allocation Status</th>
        </tr>
      </thead>
      <tbody id="result-body"></tbody>
      <tfoot id="result-footer"></tfoot>
    `;

    const resultBody = table.querySelector("#result-body");
    const resultFooter = table.querySelector("#result-footer");
    const allocatedBlocks = new Set();

    for (let i = 0; i < processes.length; i++) {
        const processSize = parseInt(processes[i].value);
        let allocatedBlockSize = "-";
        let allocationStatus = "Not Allocated";

        for (let j = 0; j < blocks.length; j++) {
            const blockSize = parseInt(blocks[j].value);

            if (!allocatedBlocks.has(j) && blockSize >= processSize) {
                allocatedBlocks.add(j);
                allocatedBlockSize = blockSize;
                allocationStatus = "Allocated";
                break;
            }
        }

        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${i + 1}</td>
        <td>${processSize}</td>
        <td>${allocatedBlockSize}</td>
        <td>${allocationStatus}</td>
      `;
        resultBody.appendChild(row);
    }

    const remainingBlocks = [...blocks].filter((block, index) => !allocatedBlocks.has(index));
    if (remainingBlocks.length > 0) {
        const remainingRow = document.createElement("tr");
        remainingRow.innerHTML = `
        <td colspan="4"><strong>Remaining Blocks (Not Allocated)</strong></td>
      `;
        resultFooter.appendChild(remainingRow);

        remainingBlocks.forEach((block, index) => {
            const blockSize = parseInt(block.value);
            const remainingRow = document.createElement("tr");
            remainingRow.innerHTML = `
          <td colspan="2">Block ${index + 1}</td>
          <td>${blockSize}</td>
          <td>Not Allocated</td>
        `;
            resultFooter.appendChild(remainingRow);
        });
    }

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
    resultDiv.appendChild(table);

    const inputDiv = document.getElementById("input");
    inputDiv.style.display = "none";
}

function resetFirstFit() {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
    const input = document.getElementById("input");
    input.innerHTML = "";
    input.style.display = "none";
    const numOfProcessors = document.getElementById("numOfProcessors");
    numOfProcessors.value = "";
    const memoryBlocks = document.getElementById("memoryBlocks");
    memoryBlocks.value = "";
}

function createInputFieldsBF() {
    const numOfProcesses = document.querySelector("#numOfProcessors").value;
    const memoryBlocks = document.querySelector("#memoryBlocks").value;
    const inputDiv = document.getElementById("input");

    inputDiv.style.display = "flex";

    if (numOfProcesses > 0 && numOfProcesses <= 10) {
        for (let i = 0; i < numOfProcesses; i++) {
            const input = document.createElement("input");
            input.placeholder = `Process Size for Process ${i + 1}`;
            input.type = "number";
            input.classList = "process";
            inputDiv.appendChild(input);
            inputDiv.appendChild(document.createElement("br"));
        }
    } else {
        alert("Number of Processes must be between 1 and 10");
        return;
    }

    if (memoryBlocks > 1) {
        for (let i = 0; i < memoryBlocks; i++) {
            const inputBlock = document.createElement("input");
            inputBlock.placeholder = `Memory Size for Block ${i + 1}`;
            inputBlock.type = "number";
            inputBlock.classList = "block";
            inputDiv.appendChild(inputBlock);
            inputDiv.appendChild(document.createElement("br"));
        }
    }

    const calculateBtn = document.createElement("button");
    calculateBtn.innerHTML = "Calculate";
    calculateBtn.classList = "btn";
    calculateBtn.onclick = () => {
        calculateFirstFit();
    };
    inputDiv.appendChild(calculateBtn);
    document.querySelector("#numOfProcessors").value = "";
    document.querySelector("#memoryBlocks").value = "";
}

function calculateBestFit() {
    const processes = document.querySelectorAll("#input .process");
    const blocks = document.querySelectorAll("#input .block");

    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>Process No.</th>
          <th>Process Size</th>
          <th>Allocated Block Size</th>
          <th>Allocation Status</th>
        </tr>
      </thead>
      <tbody id="result-body"></tbody>
      <tfoot id="result-footer"></tfoot>
    `;

    const resultBody = table.querySelector("#result-body");
    const resultFooter = table.querySelector("#result-footer");
    const allocatedBlocks = new Map();

    for (let i = 0; i < processes.length; i++) {
        const processSize = parseInt(processes[i].value);
        let allocatedBlockSize = "-";
        let allocationStatus = "Not Allocated";
        let bestFitIndex = -1;
        let bestFitSize = Infinity;

        for (let j = 0; j < blocks.length; j++) {
            const blockSize = parseInt(blocks[j].value);

            if (!allocatedBlocks.has(j) && blockSize >= processSize && blockSize < bestFitSize) {
                bestFitIndex = j;
                bestFitSize = blockSize;
            }
        }

        if (bestFitIndex !== -1) {
            allocatedBlocks.set(bestFitIndex, true);
            allocatedBlockSize = blocks[bestFitIndex].value;
            allocationStatus = "Allocated";
        }

        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${i + 1}</td>
        <td>${processSize}</td>
        <td>${allocatedBlockSize}</td>
        <td>${allocationStatus}</td>
      `;
        resultBody.appendChild(row);
    }

    const remainingBlocks = [...blocks].filter((block, index) => !allocatedBlocks.has(index));
    if (remainingBlocks.length > 0) {
        const remainingRow = document.createElement("tr");
        remainingRow.innerHTML = `
        <td colspan="4"><strong>Remaining Blocks (Not Allocated)</strong></td>
      `;
        resultFooter.appendChild(remainingRow);

        remainingBlocks.forEach((block, index) => {
            const blockSize = parseInt(block.value);
            const remainingRow = document.createElement("tr");
            remainingRow.innerHTML = `
          <td colspan="2">Block ${index + 1}</td>
          <td>${blockSize}</td>
          <td>Not Allocated</td>
        `;
            resultFooter.appendChild(remainingRow);
        });
    }

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
    resultDiv.appendChild(table);

    const inputDiv = document.getElementById("input");
    inputDiv.style.display = "none";
}

function resetBestFit() {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
    const input = document.getElementById("input");
    input.innerHTML = "";
    input.style.display = "none";
    const numOfProcessors = document.getElementById("numOfProcessors");
    numOfProcessors.value = "";
    const memoryBlocks = document.getElementById("memoryBlocks");
    memoryBlocks.value = "";
}

function createInputFieldsWF() {
    const numOfProcesses = document.querySelector("#numOfProcessors").value;
    const memoryBlocks = document.querySelector("#memoryBlocks").value;
    const inputDiv = document.getElementById("input");

    inputDiv.style.display = "flex";

    if (numOfProcesses > 0 && numOfProcesses <= 10) {
        for (let i = 0; i < numOfProcesses; i++) {
            const input = document.createElement("input");
            input.placeholder = `Process Size for Process ${i + 1}`;
            input.type = "number";
            input.classList = "process";
            inputDiv.appendChild(input);
            inputDiv.appendChild(document.createElement("br"));
        }
    } else {
        alert("Number of Processes must be between 1 and 10");
        return;
    }

    if (memoryBlocks > 1) {
        for (let i = 0; i < memoryBlocks; i++) {
            const inputBlock = document.createElement("input");
            inputBlock.placeholder = `Memory Size for Block ${i + 1}`;
            inputBlock.type = "number";
            inputBlock.classList = "block";
            inputDiv.appendChild(inputBlock);
            inputDiv.appendChild(document.createElement("br"));
        }
    }

    const calculateBtn = document.createElement("button");
    calculateBtn.innerHTML = "Calculate";
    calculateBtn.classList = "btn";
    calculateBtn.onclick = () => {
        calculateWorstFit();
    };
    inputDiv.appendChild(calculateBtn);
    document.querySelector("#numOfProcessors").value = "";
    document.querySelector("#memoryBlocks").value = "";
}

function calculateWorstFit() {
    const processes = document.querySelectorAll("#input .process");
    const blocks = document.querySelectorAll("#input .block");

    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>Process No.</th>
          <th>Process Size</th>
          <th>Allocated Block Size</th>
          <th>Allocation Status</th>
        </tr>
      </thead>
      <tbody id="result-body"></tbody>
      <tfoot id="result-footer"></tfoot>
    `;

    const resultBody = table.querySelector("#result-body");
    const resultFooter = table.querySelector("#result-footer");
    const allocatedBlocks = new Map();

    for (let i = 0; i < processes.length; i++) {
        const processSize = parseInt(processes[i].value);
        let allocatedBlockSize = "-";
        let allocationStatus = "Not Allocated";
        let worstFitIndex = -1;
        let worstFitSize = -Infinity;

        for (let j = 0; j < blocks.length; j++) {
            const blockSize = parseInt(blocks[j].value);

            if (!allocatedBlocks.has(j) && blockSize >= processSize && blockSize > worstFitSize) {
                worstFitIndex = j;
                worstFitSize = blockSize;
            }
        }

        if (worstFitIndex !== -1) {
            allocatedBlocks.set(worstFitIndex, true);
            allocatedBlockSize = blocks[worstFitIndex].value;
            allocationStatus = "Allocated";
        }

        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${i + 1}</td>
        <td>${processSize}</td>
        <td>${allocatedBlockSize}</td>
        <td>${allocationStatus}</td>
      `;
        resultBody.appendChild(row);
    }

    const remainingBlocks = [...blocks].filter((block, index) => !allocatedBlocks.has(index));
    if (remainingBlocks.length > 0) {
        const remainingRow = document.createElement("tr");
        remainingRow.innerHTML = `
        <td colspan="4"><strong>Remaining Blocks (Not Allocated)</strong></td>
      `;
        resultFooter.appendChild(remainingRow);

        remainingBlocks.forEach((block, index) => {
            const blockSize = parseInt(block.value);
            const remainingRow = document.createElement("tr");
            remainingRow.innerHTML = `
          <td colspan="2">Block ${index + 1}</td>
          <td>${blockSize}</td>
          <td>Not Allocated</td>
        `;
            resultFooter.appendChild(remainingRow);
        });
    }

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
    resultDiv.appendChild(table);

    const inputDiv = document.getElementById("input");
    inputDiv.style.display = "none";
}

function resetWorstFit() {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
    const input = document.getElementById("input");
    input.innerHTML = "";
    input.style.display = "none";
    const numOfProcessors = document.getElementById("numOfProcessors");
    numOfProcessors.value = "";
    const memoryBlocks = document.getElementById("memoryBlocks");
    memoryBlocks.value = "";
}

function createInputFieldsFCFS() {
    const processes = document.querySelector("#numOfProcessors").value;
    const processesDiv = document.getElementById("processes");

    processesDiv.style.display = "flex";

    console.log(processes);

    if (processes > 0 && processes <= 10) {
        for (let i = 0; i < processes; i++) {
            const input = document.createElement("input");
            input.placeholder = `Arrival Time for Process ${i + 1}`
            input.type = "number";
            processesDiv.appendChild(input);
            processesDiv.appendChild(document.createElement("br"));
            const input2 = document.createElement("input");
            input2.placeholder = `Burst Time for Process ${i + 1}`
            input2.type = "number";
            processesDiv.appendChild(input2);
            processesDiv.appendChild(document.createElement("br"));
        }
    } else {
        alert("Please enter a number between 1 and 10.");
        return;
    }

    const calculateBtn = document.createElement("button");
    calculateBtn.innerHTML = "Calculate";
    calculateBtn.classList = "btn";
    calculateBtn.onclick = () => {
        calculateFCFS();
    };
    processesDiv.appendChild(calculateBtn);
    document.querySelector("#numOfProcessors").value = "";
}

function calculateFCFS() {
    const processesDiv = document.getElementById("processes");
    const inputs = processesDiv.getElementsByTagName("input");
    const numOfInputs = inputs.length;

    const processDetails = [];

    // Retrieve the user input values
    for (let i = 0; i < numOfInputs; i += 2) {
        const arrivalTime = parseInt(inputs[i].value);
        const burstTime = parseInt(inputs[i + 1].value);
        processDetails.push({ arrivalTime, burstTime });
    }

    // Sort the processes based on arrival time
    processDetails.sort((a, b) => a.arrivalTime - b.arrivalTime);

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const tfoot = document.createElement("tfoot");
    const resultBody = document.getElementById("result-body");

    table.appendChild(thead);
    table.appendChild(tbody);
    table.appendChild(tfoot);
    resultBody.appendChild(table);

    // Create table header
    const headerRow = document.createElement("tr");
    const headers = ["Process", "Arrival Time", "Burst Time", "Completion Time", "Turnaround Time", "Waiting Time"];

    for (let i = 0; i < headers.length; i++) {
        const headerCell = document.createElement("th");
        headerCell.textContent = headers[i];
        headerRow.appendChild(headerCell);
    }

    thead.appendChild(headerRow);

    let completionTimeSum = 0;
    let turnaroundTimeSum = 0;
    let waitingTimeSum = 0;

    // Calculate completion time, turnaround time, and waiting time for each process
    for (let i = 0; i < processDetails.length; i++) {
        const process = processDetails[i];
        const completionTime = Math.max(completionTimeSum, process.arrivalTime) + process.burstTime;
        const turnaroundTime = completionTime - process.arrivalTime;
        const waitingTime = turnaroundTime - process.burstTime;

        completionTimeSum = completionTime;
        turnaroundTimeSum += turnaroundTime;
        waitingTimeSum += waitingTime;

        // Create table row for each process
        const row = document.createElement("tr");
        const processCell = document.createElement("td");
        const arrivalCell = document.createElement("td");
        const burstCell = document.createElement("td");
        const completionCell = document.createElement("td");
        const turnaroundCell = document.createElement("td");
        const waitingCell = document.createElement("td");

        processCell.textContent = i + 1;
        arrivalCell.textContent = process.arrivalTime;
        burstCell.textContent = process.burstTime;
        completionCell.textContent = completionTime;
        turnaroundCell.textContent = turnaroundTime;
        waitingCell.textContent = waitingTime;

        row.appendChild(processCell);
        row.appendChild(arrivalCell);
        row.appendChild(burstCell);
        row.appendChild(completionCell);
        row.appendChild(turnaroundCell);
        row.appendChild(waitingCell);

        tbody.appendChild(row);
    }

    const avgCompletionTime = completionTimeSum / processDetails.length;
    const avgTurnaroundTime = turnaroundTimeSum / processDetails.length;
    const avgWaitingTime = waitingTimeSum / processDetails.length;

    // Create table footer
    const footerRow = document.createElement("tr");
    const avgCompletionCell = document.createElement("td");
    const avgTurnaroundCell = document.createElement("td");
    const avgWaitingCell = document.createElement("td");

    avgCompletionCell.textContent = "Average";
    avgTurnaroundCell.colSpan = 1;
    avgTurnaroundCell.textContent = "Completion Time";
    avgWaitingCell.textContent = avgCompletionTime.toFixed(2);

    const avgCompletionTimeCell = document.createElement("td");
    const avgTurnaroundTimeCell = document.createElement("td");
    const avgWaitingTimeCell = document.createElement("td");

    avgCompletionTimeCell.id = "avg-completion-time";
    avgTurnaroundTimeCell.id = "avg-turnaround-time";
    avgWaitingTimeCell.id = "avg-waiting-time";

    avgCompletionTimeCell.textContent = avgCompletionTime.toFixed(2);
    avgTurnaroundTimeCell.textContent = avgTurnaroundTime.toFixed(2);
    avgWaitingTimeCell.textContent = avgWaitingTime.toFixed(2);

    footerRow.appendChild(avgCompletionCell);
    footerRow.appendChild(avgTurnaroundCell);
    footerRow.appendChild(avgWaitingCell);
    footerRow.appendChild(avgCompletionTimeCell);
    footerRow.appendChild(avgTurnaroundTimeCell);
    footerRow.appendChild(avgWaitingTimeCell);

    tfoot.appendChild(footerRow);
}



function resetFCFS() {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
    const processDiv = document.getElementById("processes");
    processDiv.innerHTML = "";
    processDiv.style.display = "none";
    const numOfProcessors = document.getElementById("numOfProcessors");
    numOfProcessors.value = "";
}