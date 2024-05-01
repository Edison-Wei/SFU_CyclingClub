import Link from "next/link";

/**
 * Creates an Text section with Title, Text/Text array, Link to place
 * Title: Title of that section
 * @param {title, text, link, linkText} param0 
 * @returns 
 */
export default function TextWithButton({ title, text, stext, link, linkText}) {
    return (
        <div className="p-6 grid gap-2 place-items-center" >
            <TitleSection title={title} />
            <SmallText stext={stext} />
            <TextSection text={text}/>
            <CreateLink link={link} linkText={linkText}/>
        </div>
    )
}

function TitleSection({title}) {
    return (
        <div className="md:text-[16px] lg:text-[22px]">
            <h1>{title}</h1>
        </div>
    )
}

export function SmallText({ stext }) {
    return (
        <div className="md:text-[20px]">
            {stext}
        </div>
    )
}

function TextSection({text}) {
    function TextPart({textSeperated}) {
        return (
            <div className="md:text-[12px] lg:text-[18px] text-wrap">
                <p>{textSeperated}</p>
            </div>
        )
    }

    const textSeperated = (Array.isArray(text))? text.slice() : text;

    return (
        <div className="Text-With-Button-Text">
            <TextPart textSeperated={textSeperated} />
        </div>
    )
}


export function CreateLink({ link, linkText }) {
    return <Link href={link} className="md:px-4">{linkText}</Link>
  }