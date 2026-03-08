type CncArrType = {
    class: string;
    apply: boolean;
};
export const cn = (...classes: Array<string | undefined>) => {
    return classes.filter(Boolean).join(" ");
};

export const cnc = (...classes: Array<CncArrType | undefined>) => {
    return classes.filter((val) => val && val.apply).join(" ");
};
