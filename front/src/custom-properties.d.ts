declare namespace JSX {
    interface IntrinsicElements {
        span: React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLSpanElement>,
            HTMLSpanElement
        > & {
            style?: {
                "--value"?: number | string;
            };
        };
    }
}
