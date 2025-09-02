let variables = {};
let functions = {};
let running = false;
let inputResolve = null;

async function getInput(varName) {
    const popup = document.getElementById("inputPopup");
    const userInput = document.getElementById("userInput");

    popup.style.display = "flex";
    userInput.value = "";
    userInput.placeholder = `Enter ${varName}`;
    userInput.focus();

    return new Promise(resolve => {
        inputResolve = (val) => {
            popup.style.display = "none";
            resolve(val);
        };
    });
}

function submitInput() {
    if (inputResolve) {
        const val = document.getElementById("userInput").value;
        inputResolve(val);
        inputResolve = null;
    }
}

async function runScribble() {
    if (running) return;
    running = true;

    const code = document.getElementById("scribbleCode").value.split("\n");
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";
    variables = {};
    functions = {};

    let i = 0;
    while (i < code.length && running) {
        let line = code[i].trim();

        // Skip empty lines and comments >> ... <<
        if (!line || (line.startsWith(">>") && line.endsWith("<<"))) { i++; continue; }

        // Variable assignment
        if (line.startsWith("var=")) {
            let [varName, varVal] = line.split("=");
            varName = varName.slice(4).trim();
            varVal = varVal.trim().slice(2, -2);

            if (varVal.includes("<input>")) {
                variables[varName] = await getInput(varName);
            } 
            else if (varVal.includes("math@results[")) {
                let expr = varVal.split("math@results[")[1].split("]")[0];
                for (let v in variables) expr = expr.replace(`<var=${v}>`, variables[v]);
                try { variables[varName] = eval(expr); } catch(e) { variables[varName] = 0; }
            } 
            else if (varVal.includes("math@random[")) {
                let [min,max] = varVal.split("math@random[")[1].split("]")[0].split("-").map(Number);
                variables[varName] = Math.floor(Math.random() * (max-min+1)) + min;
            } 
            else {
                variables[varName] = varVal;
            }
            i++; 
            continue;
        }

        // Output
        if (line.toLowerCase().startsWith("output[")) {
            let out = line.slice(7, -1);
            for (let v in variables) {
                let regex = new RegExp(`<var=${v}>`, "g");
                out = out.replace(regex, variables[v]);
            }
            outputDiv.innerHTML += out + "<br>";
            i++;
            continue;
        }

        // Debug
        if (line.startsWith("Debug[")) {
            let varName = line.slice(6, -1);
            outputDiv.innerHTML += `Debug: ${varName} = ${variables[varName]}<br>`;
            i++;
            continue;
        }

        // Function definition
        if (line.startsWith("function[")) {
            let funcName = line.slice(9, -1);
            let funcBody = [];
            i++;
            while (i < code.length && !code[i].startsWith("endFunction")) {
                funcBody.push(code[i]);
                i++;
            }
            functions[funcName] = funcBody;
            i++;
            continue;
        }

        // Function call
        if (line.startsWith("call[")) {
            let funcName = line.slice(5, -1);
            if (functions[funcName]) {
                await runFunction(functions[funcName], outputDiv);
            }
            i++;
            continue;
        }

        i++;
    }

    running = false;
}

async function runFunction(funcCode, outputDiv) {
    for (let j = 0; j < funcCode.length && running; j++) {
        let line = funcCode[j].trim();

        // Skip empty lines and comments
        if (!line || (line.startsWith(">>") && line.endsWith("<<"))) continue;

        // Variable assignment
        if (line.startsWith("var=")) {
            let [varName, varVal] = line.split("=");
            varName = varName.slice(4).trim();
            varVal = varVal.trim().slice(2, -2);

            if (varVal.includes("<input>")) {
                variables[varName] = await getInput(varName);
            } 
            else if (varVal.includes("math@results[")) {
                let expr = varVal.split("math@results[")[1].split("]")[0];
                for (let v in variables) expr = expr.replace(`<var=${v}>`, variables[v]);
                try { variables[varName] = eval(expr); } catch(e){ variables[varName] = 0; }
            } 
            else if (varVal.includes("math@random[")) {
                let [min,max] = varVal.split("math@random[")[1].split("]")[0].split("-").map(Number);
                variables[varName] = Math.floor(Math.random() * (max-min+1)) + min;
            } 
            else {
                variables[varName] = varVal;
            }
            continue;
        }

        // Output
        if (line.toLowerCase().startsWith("output[")) {
            let out = line.slice(7, -1);
            for (let v in variables) {
                let regex = new RegExp(`<var=${v}>`, "g");
                out = out.replace(regex, variables[v]);
            }
            outputDiv.innerHTML += out + "<br>";
            continue;
        }

        // Debug
        if (line.startsWith("Debug[")) {
            let varName = line.slice(6, -1);
            outputDiv.innerHTML += `Debug: ${varName} = ${variables[varName]}<br>`;
            continue;
        }
    }
}

function stopScribble() {
    running = false;
}
