import arcjet, { tokenBucket } from "@arcjet/next"

//Rate Limiting for loggedin Users on the creation of entries

const aj = arcjet({
    key: process.env.ARCJET_KEY!,
    characteristics: ["userId"],
    rules:[
        tokenBucket({
            mode:"LIVE",
            refillRate:10,
            interval:3600,
            capacity:10,
        }),
    ],

})

export default aj;