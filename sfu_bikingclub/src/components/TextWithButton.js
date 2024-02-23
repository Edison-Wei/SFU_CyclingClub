/**
 * Creates an Text section with Title, Text/Text array, Link to place
 * Title: Title of that section
 * @param {title, text, link, linkName} param0 
 * @returns 
 */
export default function TextWithButton({ title, text, stext, link, linkName}) {
    return (
        <div className="p-10 grid gap-2 items-center place-items-center" >
            <SmallText stext={stext} />
            <TitleSection title={title} />
            <TextSection text={text}/>
            <LinkSection link={link} linkName={linkName}/>
        </div>
    )
}

export function SmallText({ stext }) {
    return (
        <div className="text-[15px]">
            {stext}
        </div>
    )
}

function TitleSection({title}) {
    return (
        <div className="Text-With-Button-Title">
            <h1>{title}</h1>
        </div>
    )
}

function TextSection({text}) {
    function TextPart({textSeperated}) {
        return (
            <div className="Text-With-Button-TextPart">
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


function LinkSection({link, linkName}) {
    return (
        <div className="Text-With-Button-Link">
            <a href={link}>{linkName}</a>
        </div>
    )
}