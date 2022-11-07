const locationsMap = {
  americas: {
    name: 'Americas',
    regions: [
      {
        region: 'us-east-1',
        name: 'N. Virginia',
        flag: '/static/flags/us.svg',
        color: '#1f77b4',
        latitude: 38.13,
        longitude: -78.45,
      },
      {
        region: 'us-east-2',
        name: 'Ohio',
        flag: '/static/flags/us.svg',
        color: '#aec7e8',
        latitude: 39.96,
        longitude: -83,
      },
      {
        region: 'us-west-1',
        name: 'N. California',
        flag: '/static/flags/us.svg',
        color: '#ff7f0e',
        latitude: 37.35,
        longitude: -121.96,
      },
      {
        region: 'us-west-2',
        name: 'Oregon',
        flag: '/static/flags/us.svg',
        color: '#ffbb78',
        latitude: 46.15,
        longitude: -123.88,
      },
      {
        region: 'ca-central-1',
        name: 'Montreal',
        flag: '/static/flags/canada.svg',
        color: '#2ca02c',
        latitude: 45.5,
        longitude: -73.6,
      },
      {
        region: 'sa-east-1',
        name: 'São Paulo',
        flag: '/static/flags/brazil.svg',
        color: '#98df8a',
        latitude: -23.34,
        longitude: -46.38,
      },
    ],
  },
  emea: {
    name: 'Europe / Middle East / Africa',
    regions: [
      {
        region: 'eu-west-1',
        name: 'Ireland',
        flag: '/static/flags/ireland.svg',
        color: '#d652b1',
        latitude: 53,
        longitude: -8,
      },
      {
        region: 'eu-central-1',
        name: 'Frankfurt',
        flag: '/static/flags/germany.svg',
        color: '#ff9896',
        latitude: 50,
        longitude: 8,
      },
      {
        region: 'eu-west-2',
        name: 'London',
        flag: '/static/flags/uk.svg',
        color: '#9467bd',
        latitude: 51,
        longitude: -0.1,
      },
      {
        region: 'eu-west-3',
        name: 'Paris',
        flag: '/static/flags/france.svg',
        color: '#c5b0d5',
        latitude: 48.86,
        longitude: 2.35,
      },
      {
        region: 'eu-north-1',
        name: 'Stockholm',
        flag: '/static/flags/sweden.svg',
        color: '#8c564b',
        latitude: 59.32,
        longitude: 18.06,
      },
      {
        region: 'eu-south-1',
        name: 'Milan',
        flag: '/static/flags/italy.svg',
        color: '#1fd535',
        latitude: 45.46,
        longitude: 9.19,
      },
      {
        region: 'me-south-1',
        name: 'Bahrain',
        flag: '/static/flags/bahrain.svg',
        color: 'rgba(99,16,50,0.85)',
        latitude: 26.07,
        longitude: 50.56,
      },
      {
        region: 'af-south-1',
        name: 'Cape Town',
        flag: '/static/flags/south-africa.svg',
        color: '#deca22',
        latitude: -33.92,
        longitude: 18.42,
      },
    ],
  },
  apac: {
    name: 'Asia Pacific',
    regions: [
      {
        region: 'ap-southeast-1',
        name: 'Singapore',
        flag: '/static/flags/singapore.svg',
        color: '#c49c94',
        latitude: 1.37,
        longitude: 103.8,
      },
      {
        region: 'ap-northeast-1',
        name: 'Tokyo',
        flag: '/static/flags/japan.svg',
        color: '#e377c2',
        latitude: 35.41,
        longitude: 139.42,
      },
      {
        region: 'ap-northeast-3',
        name: 'Osaka',
        flag: '/static/flags/japan.svg',
        color: '#e377c2',
        latitude: 34.67,
        longitude: 135.34,
      },
      {
        region: 'ap-east-1',
        name: 'Hong Kong',
        flag: '/static/flags/china.svg',
        color: '#e3b85d',
        latitude: 22.32,
        longitude: 114.17,
      },
      {
        region: 'ap-southeast-2',
        name: 'Sydney',
        flag: '/static/flags/australia.svg',
        color: '#f7b6d2',
        latitude: -33.86,
        longitude: 151.2,
      },
      {
        region: 'ap-southeast-3',
        name: 'Jakarta',
        flag: '/static/flags/indonesia.svg',
        color: '#6c968c',
        latitude: -6.20,
        longitude: 106.84,
      },
      {
        region: 'ap-northeast-2',
        name: 'Seoul',
        flag: '/static/flags/south-korea.svg',
        color: '#7f7f7f',
        latitude: 37.56,
        longitude: 126.98,
      },
      {
        region: 'ap-south-1',
        name: 'Mumbai',
        flag: '/static/flags/india.svg',
        color: '#c7c7c7',
        latitude: 19.08,
        longitude: 72.88,
      },
    ],
  },
}

export function getLocationName (regionOrSlugName) {
  return flatLocations[regionOrSlugName]?.name
}

export function getLocationFlag (regionOrSlugName) {
  return flatLocations[regionOrSlugName]?.flag
}

function flattenLocationsMap (_locationsMap = []) {
  const locations = {}

  const continents = Object.keys(_locationsMap) // @TODO: naming
  continents.forEach((continent) => {
    _locationsMap[continent].regions.forEach((region) => {
      locations[region.region] = {
        continentName: continent.name,
        ...region,
      }
    })
  })

  return locations
}

export const flatLocations = flattenLocationsMap(locationsMap)
