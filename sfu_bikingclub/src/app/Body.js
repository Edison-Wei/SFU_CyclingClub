"use client"
import TextWithButton from "./components/TextWithButton"
import SmallText from "./components/TextWithButton"
import { useEffect, useState } from "react";
import Link from "next/link";

const DATA_SOURCE_URL = "http://jsonplaceholder.typicode.com/todos";

// This for local things
async function fetchDemoData() {
    try {
        const res = await axios.get(
            "http://jsonplaceholder.typicode.com/todos"
        );
        console.log(res)
        return res.json();
    } catch(error) {
        console.error("Error: ", error);
        return null;
    }
}

export default function Body() {
    // const [data, setData] = useState();

    // // Just fetch is for actual api calls outside
    // useEffect(() => {
    //     fetch(DATA_SOURCE_URL).then((res) => {
    //         return res.json()
    //     }).then((data) => {
    //         console.log(data);
    //     });
    // }, []);
    // console.log(data);

    return (
        <div className="">
            <div className="flex justify-around items-center md:h-[400px] lg:h-[600px] xl:h-[800px] bg-black text-white">
                <div className="">
                    <TextWithButton title={"Upcoming Rides!"} text={"Come join us on any of our upcoming rides!"} stext={""} link={"https://www.strava.com/clubs/1079967"} linkName={"Strava"}></TextWithButton>
                </div>
            
                <div className="flex justify-around items-center md:h-[400px] lg:h-[600px] xl:h-[800px] bg-black text-white">
                    <div className="">
                        <SmallText stext={"Map Here"} />
                        <CreateLink link={"./Suggestion"} linkText={"Make a Suggestion"} />
                    </div>
                </div>
            </div>
            <div className="flex justify-around items-center md:h-[400px] lg:h-[600px] xl:h-[800px]">
                <div>
                    Previous Rides
                </div>
                <div>
                    Thing 2
                </div>
            </div>
            <div className="flex justify-around md:h-[400px] lg:h-[600px] xl:h-[850px] items-center bg-black text-white">
                <div className="w-1/2 h-1/2">
                    <img src={`https://hips.hearstapps.com/hmg-prod/images/coastal-cyclists-credit-bob-markisello-1575992964.jpg?crop=0.642xw:1.00xh;0.187xw,0&resize=980:*`} 
                    alt={"Group photo of the Cycling Club (Once it happens)"} 
                    className="h-auto w-auto"/>
                </div>
                <p id="joinInformation"/>
                <TextWithButton title={"Join Our Riding Community"} text={"Hello World!"} stext={"Ready To Join the SFU Cycling Club?"} link={"https://www.sfu.ca/"} linkName={"Discord"} />
            </div>
        </div>
    )
}


function CreateLink({link, linkText}) {
    return <Link href={link} className="md:px-4">{linkText}</Link>
}