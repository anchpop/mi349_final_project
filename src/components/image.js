import React, { useState, useEffect } from "react"
import { StaticQuery, graphql, useStaticQuery } from "gatsby"

import Img from 'gatsby-image'

const Image = (props) => {
  /*const allImages = useStaticQuery(graphql`
        query {
          images: allFile {
            edges {
              node {
                relativePath
                name
                childImageSharp {
                  sizes(maxWidth: 600) {
                    ...GatsbyImageSharpSizes
                  }
                }
              }
            }
          }
        }
      `)*/
  return (
    <StaticQuery
      query={graphql`
      query {
        images: allFile {
          edges {
            node {
              relativePath
              name
              childImageSharp {
                sizes(maxWidth: 600) {
                  ...GatsbyImageSharpSizes_tracedSVG
                }
              }
            }
          }
        }
      }
    `}
  
      render={(data) => {
        const image = data.images.edges.find(n => {
          return n.node.relativePath.includes(props.filename);
        });
        if (!image) { 
          console.log("Couldn't find image at " + props.filename, "Options were ", data.images.edges);
          return null; 
        }
        
        const imageSizes = image.node.childImageSharp.sizes;
        return (
          <Img
            alt={props.alt}
            sizes={imageSizes}
          />
        );
      }}
    />
  )
}
export default Image