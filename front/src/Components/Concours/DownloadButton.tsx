import { RefObject, forwardRef } from "react";
import AnimatedButton from "../FormElements/animatedButton";
import { UilFileDownload } from "@iconscout/react-unicons";

type Props = {
    ref: RefObject<HTMLAnchorElement>;
    fullPath: string;
    text:string;
    disabled?: boolean;
};

const DownloadButton = forwardRef<HTMLAnchorElement, Props>(({ fullPath, text, disabled }, ref) => {

    const handleDownloadClick = () => {
        const encodedPath = encodeURIComponent(fullPath.replace("./public", ""));
        const downloadLink = `${
            import.meta.env.VITE_BackendBaseUrl
        }/download/${encodedPath}`;
        if ((ref as RefObject<HTMLAnchorElement>).current) {
            (ref as RefObject<HTMLAnchorElement>).current!.href = downloadLink;
        }
        return downloadLink;
    };

    return (
        <a
            ref={ref}
            aria-disabled={disabled}
            onClick={() => !disabled && handleDownloadClick()}
            download={ !disabled && fullPath.split("/").pop()}
        >
            <AnimatedButton
                Icon={() => (
                    <UilFileDownload className="mx-auto w-7 h-7 text-slate-400" />
                )}
                customButtonClasses={[
                    "!m-0",
                    "!w-24",
                    "btn-outline",
                    "border-slate-400",
                    "btn-sm",
                    "text-xs",
                    "font-medium",
                    "w-full",
                    "border-2",
                    "hover:!border-2",
                    "hover:border-slate-400",
                    "hover:bg-slate-400",
                ]}
                text={text}
                disabled={disabled}
            />
        </a>
    );
});

export default DownloadButton;
