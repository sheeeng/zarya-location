'use strict'

const got = require('got')
const geolib = require('geolib')

const delaySeconds = 3
const url = 'http://api.open-notify.org/iss-now.json'
const localPosition = { latitude: 59.9503479, longitude: 10.907592799999975 }

function loop () {
  got(url, { json: true })
  .then(iss => {
    const issPosition = iss.body.iss_position
    console.log(issPosition)
    const sexagesimalLatitude = geolib.decimal2sexagesimal(iss.body.iss_position.latitude)
    const sexagesimalLongitude = geolib.decimal2sexagesimal(iss.body.iss_position.longitude)
    console.log(`Latitude: ${sexagesimalLatitude}, Longitude: ${sexagesimalLongitude}`)

    const distanceFromIss = geolib.getDistance(localPosition, issPosition)
    const distanceFromIssKm = geolib.convertUnit('km', distanceFromIss, 3)
    console.log(`Local distance to ISS: ${distanceFromIssKm} km`)

    const compassDirectionToIss = geolib.getCompassDirection(localPosition, issPosition)
    // console.log(compassDirectioniToIss);
    console.log(`ISS located ${compassDirectionToIss.exact} with ${compassDirectionToIss.bearing} bearing.`)
  })
  .catch(error => {
    console.log(error.response.body)
  })
  setTimeout(loop, delaySeconds * 1000)
}

loop()

