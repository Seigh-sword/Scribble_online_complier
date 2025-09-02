let variables = {};

function runScribble() {
    const code = document.getElementById("scribbleCode").value.split("\n");
    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";
    variables = {};

    for (let i = 0; i < code.length; i++) {
        let line = code[i].trim();
        if (!line || line.startsWith(">>")) continue;

        // Output
        if (line.toLowerCase().startsWith("output[")) {
            let out = line.slice(7, -1);
            for (let v in variables) {
                out = out.replace(`<var=${v}>`, variables[v]);
            }
            outputDiv.innerHTML += out + "<br>";
        }

        // Variable assignment
        else if (line.startsWith("var=")) {
            let [varName, varVal] = line.split("=");
            varName = varName.slice(4).trim();
            varVal = varVal.trim().slice(2, -2); // remove [""]

            if (varVal.includes("<input>")) {
                variables[varName] = prompt("Enter " + varName);
            } else if (varVal.includes("math@results[")) {
                let expr = varVal.split("math@results[")[1].split("]")[0];
                for (let v in variables) expr = expr.replace(`<var=${v}>`, variables[v]);
                variables[varName] = eval(expr);
            } else if (varVal.includes("math@random[")) {
                let [min,max] = varVal.split("math@random[")[1].split("]")[0].split("-").map(Number);
                variables[varName] = Math.floor(Math.random() * (max-min+1)) + min;
            } else {
                variables[varName] = varVal;
            }
        }

        // TODO: Add if-then-else parser in v0.2
    }
}

// Load sample .srb files (basic fetch)
function loadSample(path) {
    fetch(path)
        .then(res => res.text())
        .then(text => {
            document.getElementById("scribbleCode").value = text;
            document.getElementById("output").innerHTML = "";
        });
}
