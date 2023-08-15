import { IntroJs } from "intro.js";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setTab } from "../../../redux/RegisterationForm/formTabs";

type Props = {
    tab1Text: string;
    tab2Text: string;
    tour?: IntroJs;
};

const Tabs = ({ tab1Text, tab2Text, tour }: Props) => {
    const dispatch = useAppDispatch();
    const { tab, hint } = useAppSelector(state => state.formTabs);

    return (
        <div className="tabs">
            <a
                className={`tab tab-lifted rounded-l-box ${
                    tab == 1 ? "font-bold tab-active" : ""
                }`}
                onClick={() => {
                    tab === 2 && dispatch(setTab(1));
                }}
            >
                {tab1Text}
            </a>
            <div className="indicator">
                {tab !== 2 && hint > 0 && (
                    <span className="indicator-item badge badge-info">
                        {hint}
                    </span>
                )}
                <a
                    className={`tab tab-lifted rounded-r-box  ${
                        tab == 2 ? "font-bold tab-active" : ""
                    }`}
                    onClick={() => {
                        tab === 1 && dispatch(setTab(2));
                        tour?.exit();
                    }}
                >
                    <span id="tab2">{tab2Text}</span>
                </a>
            </div>
        </div>
    );
};

export default Tabs;
