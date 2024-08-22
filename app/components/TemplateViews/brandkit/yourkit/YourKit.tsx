'use client'
import React, { useState } from 'react'
import styles from './yourkit.style.module.css'
import DefaultKit from './defaultkit/DefaultKit';

const YourKit = () => {

    return (
        <div className={styles.body}>
            <DefaulKit kitName="default" />
        </div>
    )
}

export default YourKit