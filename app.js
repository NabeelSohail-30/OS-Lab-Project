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
