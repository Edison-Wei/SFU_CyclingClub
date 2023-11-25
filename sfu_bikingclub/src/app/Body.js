import TextWithButton from "./components/TextWithButton"

const link = "https://www.sfu.ca/";

export default function Body() {
    return (
        <TextWithButton title={"Tester"} text={"Hello World!"} link={link} linkName={"Site"} />
    )
}