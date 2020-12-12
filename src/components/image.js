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
                fluid(maxWidth: 600) {
                  ...GatsbyImageSharpFluid_tracedSVG
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
        
        const imageFluid = image.node.childImageSharp.fluid;
        return (
          <Img
            alt={props.alt}
            fluid={imageFluid}
          />
        );
      }}
    />
  )
}
export default Image