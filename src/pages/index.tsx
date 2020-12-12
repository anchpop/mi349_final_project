import React, { useState, useEffect, useReducer } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import { sortBy, isEqual } from "lodash"
import haversine from "haversine-distance"

import {
  Box,
  Badge,
  Image,
  Heading,
  SimpleGrid,
  GridItem,
  Switch,
  FormControl,
  FormLabel,
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
              ml={artist.new ? "2" : "0"}
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
      </Box>
    </Box>
  )
}

const defaultLocation = {
  latitude: 42.733982,
  longitude: -84.474842,
} // where I live lol

const IndexPage = () => {
  const [locationEnabled, toggleLocationEnabled] = useReducer(
    locationEnabled => !locationEnabled,
    false
  )
  const [currentLocation, setCurrentLocation] = useState(defaultLocation)
  useEffect(() => {
    if (locationEnabled) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        console.log("Latitude is :", position.coords.latitude)
        console.log("Longitude is :", position.coords.longitude)
      })
    } else {
      setCurrentLocation(defaultLocation)
    }
  }, [locationEnabled])

  const artistsSortedDefault = sortBy(
    artistData.artists,
    ({ latitude, longitude }) =>
      haversine(defaultLocation, { latitude, longitude })
  )

  const artistsSorted = sortBy(artistData.artists, ({ latitude, longitude }) =>
    haversine(currentLocation, { latitude, longitude })
  )

  return (
    <Layout>
      <SEO title="Home" />
      <Heading as="h4" size="md" paddingBottom={3}>
        <Box as="span" paddingRight={2}>
          See who's closest?
        </Box>
        <Box as="span" paddingRight={2}>
          <Switch
            id="proximity_scan"
            isChecked={locationEnabled}
            onChange={() => toggleLocationEnabled()}
          />
        </Box>
        {!isEqual(currentLocation, defaultLocation)
          ? "Sorted!" /* +
            (isEqual(artistsSorted, artistsSortedDefault)
              ? " But nothing changed :3"
              : "") */
          : ""}
      </Heading>
      <Heading as="h6" size="sm" paddingBottom={5}>
        (Click on an artist to see their Instagram)
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
