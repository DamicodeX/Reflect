import arcjet, { tokenBucket } from "@arcjet/next"

//Rate Limiting for loggedin Users on the creation of entries

const key = process.env.ARCJET_KEY;
if (!key) throw new Error('ARCJET_KEY environment variable is not set');

const aj = arcjet({
    key: key,
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