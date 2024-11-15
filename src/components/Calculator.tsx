import React, { useState, useEffect } from 'react';
import { History, Plus, Minus, X, Divide, Trash2, RotateCcw } from 'lucide-react';

type MemoryOperation = 'MC' | 'MR' | 'M+' | 'M-' | 'MS';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleNumber = (num: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    try {
      setExpression(expression + display + op);
      setDisplay('0');
    } catch {
      setDisplay('Error');
    }
  };

  const handleEquals = () => {
    try {
      const result = evaluateExpression(expression + display);
      setHistory([`${expression}${display} = ${result}`, ...history.slice(0, 9)]);
      setExpression('');
      setDisplay(result.toString());
    } catch {
      setDisplay('Error');
    }
  };

  const handleMemory = (operation: MemoryOperation) => {
    const currentValue = parseFloat(display);
    switch (operation) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(memory.toString());
        break;
      case 'M+':
        setMemory(memory + currentValue);
        break;
      case 'M-':
        setMemory(memory - currentValue);
        break;
      case 'MS':
        setMemory(currentValue);
        break;
    }
  };

  const handleFunction = (func: string) => {
    try {
      const num = parseFloat(display);
      let result: number;
      switch (func) {
        case 'sin':
          result = Math.sin(num);
          break;
        case 'cos':
          result = Math.cos(num);
          break;
        case 'tan':
          result = Math.tan(num);
          break;
        case 'log':
          result = Math.log10(num);
          break;
        case 'ln':
          result = Math.log(num);
          break;
        case 'sqrt':
          result = Math.sqrt(num);
          break;
        default:
          return;
      }
      setDisplay(result.toString());
    } catch {
      setDisplay('Error');
    }
  };

  const evaluateExpression = (expr: string): number => {
    // This is a simplified version. In production, use a proper expression parser
    return new Function('return ' + expr.replace(/×/g, '*').replace(/÷/g, '/'))();
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    const key = event.key;
    if (/[0-9]/.test(key)) {
      handleNumber(key);
    } else if (['+', '-', '*', '/', '(', ')'].includes(key)) {
      handleOperator(key);
    } else if (key === 'Enter') {
      handleEquals();
    } else if (key === 'Escape') {
      setDisplay('0');
      setExpression('');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [display, expression]);

  const Button = ({ children, onClick, className = '' }: any) => (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg transition-all duration-200 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Display */}
          <div className="p-4 bg-gray-700">
            <div className="text-right">
              <div className="text-gray-400 text-sm h-6">{expression}</div>
              <div className="text-3xl font-light tracking-wider">{display}</div>
            </div>
          </div>

          {/* History Drawer */}
          {showHistory && (
            <div className="bg-gray-750 p-4 border-t border-gray-600">
              <h3 className="text-lg font-semibold mb-2">History</h3>
              {history.map((entry, index) => (
                <div key={index} className="text-sm text-gray-300 mb-1">
                  {entry}
                </div>
              ))}
            </div>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-1 p-2 bg-gray-800">
            {/* Memory Row */}
            <Button onClick={() => handleMemory('MC')} className="bg-gray-700 hover:bg-gray-600">MC</Button>
            <Button onClick={() => handleMemory('MR')} className="bg-gray-700 hover:bg-gray-600">MR</Button>
            <Button onClick={() => handleMemory('M+')} className="bg-gray-700 hover:bg-gray-600">M+</Button>
            <Button onClick={() => handleMemory('M-')} className="bg-gray-700 hover:bg-gray-600">M-</Button>

            {/* Function Row */}
            <Button onClick={() => handleFunction('sin')} className="bg-gray-700 hover:bg-gray-600">sin</Button>
            <Button onClick={() => handleFunction('cos')} className="bg-gray-700 hover:bg-gray-600">cos</Button>
            <Button onClick={() => handleFunction('tan')} className="bg-gray-700 hover:bg-gray-600">tan</Button>
            <Button onClick={() => handleFunction('log')} className="bg-gray-700 hover:bg-gray-600">log</Button>

            {/* Numbers and Operators */}
            <Button onClick={() => handleNumber('7')} className="bg-gray-900 hover:bg-gray-700">7</Button>
            <Button onClick={() => handleNumber('8')} className="bg-gray-900 hover:bg-gray-700">8</Button>
            <Button onClick={() => handleNumber('9')} className="bg-gray-900 hover:bg-gray-700">9</Button>
            <Button onClick={() => handleOperator('÷')} className="bg-indigo-600 hover:bg-indigo-500">
              <Divide size={20} className="mx-auto" />
            </Button>

            <Button onClick={() => handleNumber('4')} className="bg-gray-900 hover:bg-gray-700">4</Button>
            <Button onClick={() => handleNumber('5')} className="bg-gray-900 hover:bg-gray-700">5</Button>
            <Button onClick={() => handleNumber('6')} className="bg-gray-900 hover:bg-gray-700">6</Button>
            <Button onClick={() => handleOperator('×')} className="bg-indigo-600 hover:bg-indigo-500">
              <X size={20} className="mx-auto" />
            </Button>

            <Button onClick={() => handleNumber('1')} className="bg-gray-900 hover:bg-gray-700">1</Button>
            <Button onClick={() => handleNumber('2')} className="bg-gray-900 hover:bg-gray-700">2</Button>
            <Button onClick={() => handleNumber('3')} className="bg-gray-900 hover:bg-gray-700">3</Button>
            <Button onClick={() => handleOperator('-')} className="bg-indigo-600 hover:bg-indigo-500">
              <Minus size={20} className="mx-auto" />
            </Button>

            <Button onClick={() => handleNumber('0')} className="bg-gray-900 hover:bg-gray-700">0</Button>
            <Button onClick={() => handleNumber('.')} className="bg-gray-900 hover:bg-gray-700">.</Button>
            <Button onClick={handleEquals} className="bg-indigo-500 hover:bg-indigo-400">=</Button>
            <Button onClick={() => handleOperator('+')} className="bg-indigo-600 hover:bg-indigo-500">
              <Plus size={20} className="mx-auto" />
            </Button>

            {/* Bottom Row */}
            <Button 
              onClick={() => { setDisplay('0'); setExpression(''); }} 
              className="bg-red-600 hover:bg-red-500"
            >
              <Trash2 size={20} className="mx-auto" />
            </Button>
            <Button onClick={() => setShowHistory(!showHistory)} className="bg-gray-700 hover:bg-gray-600">
              <History size={20} className="mx-auto" />
            </Button>
            <Button onClick={() => handleOperator('(')} className="bg-gray-700 hover:bg-gray-600">(</Button>
            <Button onClick={() => handleOperator(')')} className="bg-gray-700 hover:bg-gray-600">)</Button>
          </div>
        </div>
      </div>
    </div>
  );
}