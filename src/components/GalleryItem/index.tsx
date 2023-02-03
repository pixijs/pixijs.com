import React from 'react'
import styles from './index.module.scss'

export interface GalleryItemType {
  title: string
  url: string
  image: string
  author: string
}

export default function GalleryItem (item: GalleryItemType): JSX.Element {
  return (
    <div className="col col--4" key={item.title}>
      <div className={styles.item}>
        <a href={item.url}>
          <div className={styles.image} style={{ backgroundImage: `url(${item.image})` }}></div>
          <h2>{ item.title }</h2>
          <p>{ item.author }</p>
        </a>
      </div>
    </div>
  )
}
