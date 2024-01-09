import TextWithButton from "./components/TextWithButton"

const link = "https://www.sfu.ca/";

export default function Body() {
    return (
        <div className="">
            <div className="md:h-[400px] bg-black">

            </div>
            <div className="md:h-[400px]">
                <div>
                    Previous Rides
                </div>
            </div>
            <div>
                <TextWithButton title={"Join Now"} text={"Hello World!"} stext={"Are You Ready To Ride?"} link={link} linkName={""} />
            </div>
        </div>
    )
}