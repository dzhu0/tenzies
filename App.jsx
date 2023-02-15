import React from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [count, setCount] = React.useState(0)
    const [record, setRecord] = React.useState(
        () => JSON.parse(localStorage.getItem("record")) || 0
    )

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            count < record && setRecord(count)
        }
    }, [dice])

    React.useEffect(() => {
        localStorage.setItem("record", JSON.stringify(record))
    }, [record])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 12; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }

    function rollDice() {
        setDice(oldDice => oldDice.map(die => {
            return die.isHeld ?
                die :
                generateNewDie()
        }))
        setCount(oldCount => oldCount + 1)
    }

    function newGame() {
        setTenzies(false)
        setDice(allNewDice())
        setCount(0)
    }

    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        }))
    }

    const diceElements = dice.map(die => (
        <Die
            key={die.id}
            value={die.value}
            isHeld={die.isHeld}
            holdDice={!tenzies && (() => holdDice(die.id))}
        />
    ))

    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same.
                Click each die to freeze it at its current value between rolls.</p>
            <h2>Record: {record}</h2>
            <h2>Number of rolls: {count}</h2>
            <div className="dice-container">
                {diceElements}
            </div>
            <button
                className="roll-dice"
                onClick={tenzies ? newGame : rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}
