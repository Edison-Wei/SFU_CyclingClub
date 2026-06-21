export const month = (m: number): string => {
    const months = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    return months[m] || "";
};

export const weekDay = (d: number): string => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[d] || "";
};

export const time12hour = (time: string): string => {
    const [hours, mins] = time.split(':');
    const h = parseInt(hours) % 12 || 12;
    return `${h}:${mins}`;
};