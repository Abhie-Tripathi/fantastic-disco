'use client'
import React, { useEffect, useState } from 'react'
import styles from './codewindow.style.module.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeProps{
    widgetId : string;
    type : string;
}
const CodeWindow = ({ widgetId, type }: CodeProps) => {
    const [code, setCode] = useState<string>("")

    useEffect(()=>{
        if(type === "Sticky"){
            setCode(`<sticky-widget sticky-id={"${widgetId}"}></sticky-widget>`)
        }else if(type === "Page"){
            setCode(`<page-widget page-id={"${widgetId}"}></page-widget>`)
        }
    },[])
  return (
      <div className={styles.container}>
          <div>Your Code</div>
          {widgetId && (
              <SyntaxHighlighter language="javascript" style={darcula}>
                  {`<script src='https://widget-webcomp-nolit.vercel.app/dist/eventgeni.js'></script>`}
              </SyntaxHighlighter>
          )}
          {widgetId && (
              <SyntaxHighlighter language="html" style={darcula}>
                 {code}
              </SyntaxHighlighter>
          )}
      </div>
  );
};

export default CodeWindow