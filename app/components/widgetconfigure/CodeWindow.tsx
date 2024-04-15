import React from 'react'
import styles from './codewindow.style.module.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeProps{
    stickyId : string;
}
const CodeWindow = ({ stickyId }: CodeProps) => {
  return (
      <div className={styles.container}>
          <div>Your Code</div>
          {stickyId && (
              <SyntaxHighlighter language="javascript" style={darcula}>
                  {`<script src='https://widget-webcomp-nolit.vercel.app/dist/eventgeni.js'></script>`}
              </SyntaxHighlighter>
          )}
          {stickyId && (
              <SyntaxHighlighter language="html" style={darcula}>
                  {`<sticky-widget sticky-id={"${stickyId}"}></sticky-widget>`}
              </SyntaxHighlighter>
          )}
      </div>
  );
};

export default CodeWindow