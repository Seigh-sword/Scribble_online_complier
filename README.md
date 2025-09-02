

---

# Scribble Online Compiler 

Welcome to **Scribble**, the online coding experience! 

Create interactive text-based games, random number adventures, or zombie battles—all in your browser. No downloads, no boring alerts, just pure Scribble magic.

---

## Features

*  Input boxes for interactive variables 
*  Math calculations (`math@results`, `math@random`) 
*  Functions and reusable code blocks 
*  Debugging support with `Debug[]` 
*  Turn-based games like Number Guesser or Zombie Battle 
*  Inline comments: `>> This is a comment <<` 
*  Fully responsive Output panel 

---

## Scribble Syntax

### Output

```scribble
Output["Hello, world!"]
Output["Your name is <var=name>"]
```

### Variables

```scribble
var=name ["<input>"]         # Take user input
var=score ["math@results[5+5]"]  # Store calculations
var=randomNum ["math@random[1-10]"] # Random number
```

### Conditional Logic

```scribble
if (<var=age> => ["18"]) then
    Output["You are an adult!"]
else
    Output["You are a kiddo!"]
```

### Functions

```scribble
function["greet"]
    Output["Hello from the function!"]
endFunction

call["greet"]
```

### Debug

```scribble
Debug["age"] 
```

### Comments

```scribble
>> This is a comment <<
```

---

## Sample Games

### Number Guesser

```scribble
Output["Welcome to the Number Guesser!"]
var=secret ["math@random[1-10]"]
var=guess ["<input>"]

if (<var=guess> => <var=secret> and <var=guess> <= <var=secret>) then
    Output["Correct! You guessed the number <var=secret>!"]
else if (<var=guess> => <var=secret>) then
    Output["Too high! The number was <var=secret>."]
else
    Output["Too low! The number was <var=secret>."]
```

### Zombie Battle

```scribble
Output["Welcome to Scribble Zombie Battle!"] 
var=playerName ["<input>"]
Output["Hello, <var=playerName>! Prepare for battle!"]
var=playerHP ["100"]
var=zombieHP ["50"]

function["attack"]
    var=damage ["math@random[10-20]"]
    var=zombieHP ["<var=zombieHP>-<var=damage>"]
    Output["You attack the zombie and deal <var=damage> damage!"]
    if (<var=zombieHP> <= ["0"]) then
        Output["The zombie is defeated! You win!"]
    else
        call["zombieAttack"]
endFunction
```

---

### Made by **Seigh sword**

---
