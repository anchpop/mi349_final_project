import React, { useState, useEffect } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import { sortBy } from "lodash"
import haversine from "haversine-distance"

import {
  Box,
  Badge,
  Image,
  Heading,
  SimpleGrid,
  GridItem,
} from "@chakra-ui/react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import LocalImage from "../components/image"
import { string } from "prop-types"

import artistData from "../../content/artists.yaml"

interface ArtistInfo {
  imageUrl: string
  imageAlt: string
  title: string
  location: string
  latitude: number
  longitude: number
  formattedPrice: string
  rating: number
  instagramHandle: string
  new: boolean
}

const Artist = ({ artist }: { artist: ArtistInfo }) => {
  return (
    <Box maxW="lg" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <a href={"https://instagram.com/" + artist.instagramHandle}>
        <LocalImage filename={artist.imageUrl} alt={artist.imageAlt} />
      </a>

      <Box p="6">
        <Box d="flex" alignItems="baseline">
          {artist.new ? (
            <Badge borderRadius="full" px="2" colorScheme="teal">
              New
            </Badge>
          ) : (
            <></>
          )}
          {
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="2"
            >
              {artist.location}
            </Box>
          }
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          {artist.title}
        </Box>

        <Box>
          <Box as="span" color="gray.600" fontSize="sm">
            $
          </Box>
          {artist.formattedPrice}
          <Box as="span" color="gray.600" fontSize="sm">
            /hour
          </Box>
        </Box>

        {/*
        <Box d="flex" mt="2" alignItems="center">
          <Box as="span" ml="2" color="gray.600" fontSize="sm">
            some number of reviews
          </Box>
        </Box>
        */}
      </Box>
    </Box>
  )
}

const IndexPage = () => {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  })
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCurrentLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
      console.log("Latitude is :", position.coords.latitude)
      console.log("Longitude is :", position.coords.longitude)
    })
  }, [])

  const artistsSorted = sortBy(artistData.artists, ({ latitude, longitude }) =>
    haversine(currentLocation, { latitude, longitude })
  )

  return (
    <Layout>
      <SEO title="Home" />
      <Heading as="h4" size="md" paddingBottom={5}>
        Give location access to sort by distance!
      </Heading>
      <div id="artistsGrid">
        {artistsSorted.map((artist, index) => (
          <div key={index} className="artistBox">
            <Artist artist={artist} />
          </div>
        ))}
      </div>
    </Layout>
  )
}
export default IndexPage
