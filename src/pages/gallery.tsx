import React from 'react'
import Layout from '@theme/Layout'
import gallery from './gallery.json'
import GalleryItem from '../components/GalleryItem'

export default function GalleryPage (): JSX.Element {
  return (<Layout title={'Gallery'}>
    <main>
      <h1 className="text--center margin--lg">PixiJS Inspiration from Around the World</h1>
      <div className="container container--fluid margin-vert--lg">
        <div className="row margin-top--lg">
          { gallery.map(GalleryItem) }
        </div>
      </div>
    </main>
  </Layout>)
}
