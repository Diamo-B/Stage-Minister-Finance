import { UilComparison, UilUser, UilGraphBar } from "@iconscout/react-unicons";
import { useState } from "react";

enum showEnum {
    concours = 'concours',
    campagnes = 'campagnes', 
}
const Stats = () => {
    const [show, setShow] = useState<showEnum|null>(null) 
    return (
        <div>
            <div className="flex justify-center gap-10">
                <label className="cursor-pointer label">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-accent hidden"
                        checked={show === "campagnes" ? true : false}
                        onChange={e => {
                            setShow(
                                e.target.checked === true
                                    ? showEnum.campagnes
                                    : null,
                            );
                        }}
                    />
                    <div
                        className={`btn w-32  ${
                            show === "campagnes"
                                ? "btn-info"
                                : "btn-outline hover:btn-info"
                        }`}
                    >
                        Campagnes
                    </div>
                </label>
                <label className="cursor-pointer label">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-accent hidden"
                        checked={show === "concours" ? true : false}
                        onChange={e => {
                            setShow(
                                e.target.checked === true
                                    ? showEnum.concours
                                    : null,
                            );
                        }}
                    />
                    <div
                        className={`btn w-32  ${
                            show === "concours"
                                ? "btn-info"
                                : "btn-outline hover:btn-info"
                        }`}
                    >
                        Concours
                    </div>
                </label>
            </div>
            <div className="w-full px-2 flex flex-col gap-2 justify-center items-center">
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <UilComparison className="w-9 h-9" />
                        </div>
                        <div className="stat-title">Campagnes</div>
                        <div className="stat-value text-center">---</div>
                        <div className="stat-desc">Jan 1st - Feb 1st</div>
                    </div>
                </div>

                <div className="stats shadow">
                    <div className="stat ">
                        <div className="stat-figure text-secondary">
                            <UilGraphBar className="w-9 h-9" />
                        </div>
                        <div className="stat-title">Concours</div>
                        <div className="stat-value">4,200</div>
                        <div className="stat-desc">↗︎ 400 (22%)</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <UilUser className="w-9 h-9" />
                        </div>
                        <div className="stat-title">Total Candidats</div>
                        <div className="stat-value">1,200</div>
                        <div className="stat-desc">↘︎ 90 (14%)</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stats;
