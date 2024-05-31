import React from 'react'
import styles from './style.module.css'
import HeroBanner from '../MultipleEvents/HeroBanner';
import ListView from '../MultipleEvents/ListView';
import GridView from '../MultipleEvents/GridView';
import ListAndGridView from '../MultipleEvents/ListAndGridView';

interface Props {
    type: string;
}

const HeroBannerAndViews = ({ type }: Props) => {
    return (
        <div className={styles.body}>
            <div className={styles.heroBanner}><HeroBanner /></div>
            <div className={styles.bottomView}>
                {type === "list" ? <ListView /> :
                type === "grid" ? <GridView /> :
                <ListAndGridView />}</div>
        </div>
    )
}

export default HeroBannerAndViews