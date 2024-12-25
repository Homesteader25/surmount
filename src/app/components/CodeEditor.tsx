'use client'
import React, { useState } from 'react';

export default function CodeEditor(){
    const [code, setCode] = useState('// Start typing your code here...');
    const lineNumbers = code.split('\n').length;
  
    const getLineInfo = (text: string, pos: number) => {
        const lineStart = text.lastIndexOf('\n', pos - 1) + 1;
        const lineEnd = text.indexOf('\n', pos);
        const actualLineEnd = lineEnd === -1 ? text.length : lineEnd;
        return {
            start: lineStart,
            end: actualLineEnd,
            text: text.substring(lineStart, actualLineEnd)
        };
    };
  
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const isModKey = e.ctrlKey || e.metaKey;
  
      // Handle Tab and Shift+Tab
      if (e.key === 'Tab' || (isModKey && (e.key === '[' || e.key === ']'))) {
        e.preventDefault();
        const shouldUnindent = e.shiftKey || e.key === '[';
        
        if (start !== end) {
          const selectedText = code.substring(start, end);
          const lines = selectedText.split('\n');
          const newLines = lines.map(line => 
            shouldUnindent ? line.replace(/^  /, '') : '  ' + line
          );
          const newText = newLines.join('\n');
          const newCode = code.substring(0, start) + newText + code.substring(end);
          setCode(newCode);
          
          setTimeout(() => {
            target.selectionStart = start;
            target.selectionEnd = start + newText.length;
          }, 0);
        } else {
          if (shouldUnindent) {
            const lineInfo = getLineInfo(code, start);
            if (lineInfo.text.startsWith('  ')) {
              const newCode = code.substring(0, lineInfo.start) + 
                             lineInfo.text.substring(2) + 
                             code.substring(lineInfo.end);
              setCode(newCode);
              setTimeout(() => {
                target.selectionStart = target.selectionEnd = Math.max(start - 2, lineInfo.start);
              }, 0);
            }
          } else {
            const newCode = code.substring(0, start) + '  ' + code.substring(end);
            setCode(newCode);
            setTimeout(() => {
              target.selectionStart = target.selectionEnd = start + 2;
            }, 0);
          }
        }
      }
      
      // Handle Ctrl+X for cutting lines
      if (isModKey && e.key === 'x' && start === end) {
        e.preventDefault();
        const lineInfo = getLineInfo(code, start);
        const includedNewline = lineInfo.end < code.length ? lineInfo.end + 1 : lineInfo.end;
        const cutText = code.substring(lineInfo.start, includedNewline);
        
        navigator.clipboard.writeText(cutText);
        const newCode = code.substring(0, lineInfo.start) + code.substring(includedNewline);
        setCode(newCode);
        
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = lineInfo.start;
        }, 0);
      }
  
      // Handle Ctrl+D for duplicating lines
      if (isModKey && e.key === 'd') {
        e.preventDefault();
        if (start === end) {
          const lineInfo = getLineInfo(code, start);
          const lineWithNewline = lineInfo.end < code.length ? 
            code.substring(lineInfo.start, lineInfo.end + 1) :
            '\n' + code.substring(lineInfo.start, lineInfo.end);
          
          const newCode = code.substring(0, lineInfo.end) + 
                         lineWithNewline + 
                         code.substring(lineInfo.end);
          setCode(newCode);
          
          setTimeout(() => {
            const newPos = lineInfo.end + lineInfo.text.length + 1;
            target.selectionStart = target.selectionEnd = newPos;
          }, 0);
        } else {
          const selectedText = code.substring(start, end);
          const newCode = code.substring(0, end) + selectedText + code.substring(end);
          setCode(newCode);
          
          setTimeout(() => {
            target.selectionStart = end;
            target.selectionEnd = end + selectedText.length;
          }, 0);
        }
      }
  
      // Handle Ctrl+/ for commenting/uncommenting
      if (isModKey && e.key === '/') {
        e.preventDefault();
        if (start === end) {
          const lineInfo = getLineInfo(code, start);
          const newLine = lineInfo.text.startsWith('// ') ?
            lineInfo.text.substring(3) :
            '// ' + lineInfo.text;
          
          const newCode = code.substring(0, lineInfo.start) + 
                         newLine + 
                         code.substring(lineInfo.end);
          setCode(newCode);
          
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = 
              start + (lineInfo.text.startsWith('// ') ? -3 : 3);
          }, 0);
        } else {
          const selectedText = code.substring(start, end);
          const lines = selectedText.split('\n');
          const allCommented = lines.every(line => line.startsWith('// '));
          
          const newLines = lines.map(line => 
            allCommented ? line.substring(3) : '// ' + line
          );
          const newText = newLines.join('\n');
          const newCode = code.substring(0, start) + newText + code.substring(end);
          setCode(newCode);
          
          setTimeout(() => {
            target.selectionStart = start;
            target.selectionEnd = start + newText.length;
          }, 0);
        }
      }
  
      // Handle Alt+Up/Down for moving lines
      if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
        const lines = code.split('\n');
        const currentLineNumber = code.substring(0, start).split('\n').length - 1;
        const targetLineNumber = e.key === 'ArrowUp' ? 
          Math.max(0, currentLineNumber - 1) : 
          Math.min(lines.length - 1, currentLineNumber + 1);
        
        if (currentLineNumber !== targetLineNumber) {
          [lines[currentLineNumber], lines[targetLineNumber]] = 
            [lines[targetLineNumber], lines[currentLineNumber]];
          
          const newCode = lines.join('\n');
          setCode(newCode);
          
          // Adjust cursor position
          setTimeout(() => {
            const diff = e.key === 'ArrowUp' ? -1 : 1;
            const currentLineStart = code.split('\n').slice(0, currentLineNumber).join('\n').length + 
                                   (currentLineNumber > 0 ? 1 : 0);
            const targetLineStart = code.split('\n').slice(0, targetLineNumber).join('\n').length + 
                                   (targetLineNumber > 0 ? 1 : 0);
            const cursorOffset = start - currentLineStart;
            const newPosition = targetLineStart + cursorOffset;
            target.selectionStart = target.selectionEnd = newPosition;
          }, 0);
        }
      }
    };
  
return (
    <div className="flex border border-gray-700 bg-gray-900 font-mono text-sm overflow-hidden">
    {/* Line numbers - fixed width */}
    <div className="w-12 p-4 text-right text-gray-500 select-none border-r border-gray-700 shrink-0">
        {Array.from({ length: lineNumbers }, (_, i) => (
        <div key={i + 1} className="leading-6">
            {i + 1}
        </div>
        ))}
    </div>

    {/* Code input area - takes remaining width */}
    <div className="flex-1 min-w-80">
        <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-full bg-transparent text-gray-100 resize-none focus:outline-none leading-6 p-4"
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        />
    </div>
    </div>
);
};