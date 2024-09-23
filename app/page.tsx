"use client";

import { useState, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import confetti from "canvas-confetti";

interface ColorCardProps {
  title?: string;
  color: string;
  text?: string;
  showColor?: boolean;
}

function ColorCard({ title, color, text, showColor }: ColorCardProps) {
  return (
    <div className="rounded-lg w-60 h-full flex flex-col items-center space-y-2">
      {title && (
        <div className="text-lg text-slate-900 font-semibold">{title}</div>
      )}

      {/* Use inline styles to set the background color */}
      <div
        className="w-full aspect-square rounded-md border shadow-sm"
        style={{ backgroundColor: `#${color}` }}
      />

      {showColor && <div className="text-xs text-slate-500">{color}</div>}
      {text && <div className="text-sm text-slate-900">{text}</div>}
    </div>
  );
}

export default function Home() {
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [targetColor, setTargetColor] = useState("777777");
  const [guessCorrect, setGuessCorrect] = useState(false);

  function handleGuess() {
    if (currentGuess.length != 6) {
      return;
    }
    if (currentGuess === targetColor) {
      setGuessCorrect(true);
      confetti();
    }
    setGuesses([currentGuess, ...guesses]);
    setCurrentGuess("");
  }

  function generateRandomColor() {
    return Math.floor(Math.random() * 16777215).toString(16);
  }

  function calculateHexCharacterValueDifference(
    target: string,
    guess: string,
    index: number
  ) {
    return parseInt(target[index], 16) - parseInt(guess[index], 16);
  }

  function generateDiffEmoji(diff: number) {
    if (diff === 0) {
      return "✅";
    }
    if (diff > 0) {
      if (diff > 2) {
        return "⏫";
      }
      return "🔼";
    }
    if (diff < -2) {
      return "⏬";
    }
    return "🔽";
  }

  useEffect(() => {
    setTargetColor(generateRandomColor());
  }, []);

  return (
    <div className="w-screen min-h-screen flex items-start justify-center">
      <div className="max-w-5xl flex flex-col items-center p-8 space-y-10">
        <div className="bg-slate-50 w-full rounded-lg shadow-md border-2 p-6 flex flex-col items-center justify-center space-y-8">
          <div className="flex flex-row space-x-10">
            <ColorCard color={targetColor} title="Target" />
            <ColorCard
              color={guesses.length > 0 ? guesses[0] : "777777"}
              title="Your Guess"
            />
          </div>
          {!guessCorrect && (
            <div className="flex flex-col items-center justify-center space-y-2">
              <p className="font-bold text-2xl">Next Guess: </p>
              <div className="flex flex-row space-x-3 items-center">
                <p className="font-bold text-3xl">#</p>
                <div className="bg-white">
                  <InputOTP
                    maxLength={6}
                    pattern={"^[0-9a-f]+$"}
                    value={currentGuess}
                    onChange={(value) => setCurrentGuess(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button variant="outline" size="icon" onClick={handleGuess}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          {guessCorrect && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="font-bold text-2xl">Correct! 🎉</p>
              <p className="font-bold text-2xl">
                The Hex Code is: #{targetColor}
              </p>
              <Button
                onClick={() => {
                  setGuessCorrect(false);
                  console.log(generateRandomColor());
                  setTargetColor(generateRandomColor());
                  setGuesses([]);
                }}
                className="font-bold text-xl border bg-slate-50 text-black hover:shadow-lg hover:bg-slate-50 transition-all duration-300"
                // style={{
                //   borderColor: `#${targetColor}`,
                //   backgroundColor: `#${targetColor}`,
                // }}
              >
                Play Again
              </Button>
            </div>
          )}
        </div>
        <div className="bg-slate-50 rounded-lg shadow-md border-2 p-6 flex flex-col items-start space-y-6 w-full text-center">
          <p className="font-bold text-2xl">Past Guesses:</p>
          <div className="w-full flex flex-col items-center space-y-5">
            {guesses.map((guess, index) => (
              <div
                key={index}
                className="flex flex-row space-x-2 border border-black rounded-md items-center p-2"
                style={{
                  background: `linear-gradient(to right, #${targetColor}64, #${guess}64)`,
                }}
              >
                <div
                  className="w-14 h-14 border rounded-md shadow-lg"
                  style={{ backgroundColor: `#${guess}` }}
                />
                <div className="grid grid-rows-2 grid-cols-6 gap-x-4 gap-y-1 text-2xl p-2  font-bold">
                  {guess.split("").map((color, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center"
                    >
                      {color}
                    </div>
                  ))}
                  {guess.split("").map((color, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center"
                    >
                      {generateDiffEmoji(
                        calculateHexCharacterValueDifference(
                          targetColor,
                          guess,
                          index
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
