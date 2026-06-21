type RawExecutiveNSponsor = {
    id: number;
    name: string;
    role: string;
    link: string;
    description: string;
}

type Executive = {
    id: number;
    name: string;
    role: string;
    description: string;
}
type Sponsor = {
    id: number;
    name: string;
    link: string;
    description: string;
}

type ImageType = {
    id: number;
    url: string;
}

export type { RawExecutiveNSponsor, Executive, Sponsor, ImageType }