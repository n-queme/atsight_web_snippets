//
//  TabsRelated.tsx
//  AtSight version 1.0.0
//
//  Created by Nathan Quême.
//

import React, { useState, useEffect } from "react"
import localization from "../utils/localizations"
import colors from "../assets/Colors"
import TextStyles from '../styles/TextStyles'
import { Link } from 'react-router-dom'





interface TabsButtonsInterface {
    tabs: TabType[]
    currentMainTab: TabType
}
/**
 * Tabs with their buttons 
 */
export function TabsButtons({ tabs, currentMainTab }: TabsButtonsInterface) {


    // States 
    const [measures, setMeasures] = useState<DOMRect[]>([]) // An array of (x, y, width, height, ...)


    // Values 
    let currentMainTabWithFallback = tabs.includes(currentMainTab) ? currentMainTab : "work"


    // Initialization of measures
    useEffect(() => {

        getMeasures()
        window.addEventListener("resize", getMeasures)

    }, [])

    function getMeasures() {
        let m: DOMRect[] = []
        let tabsContainer = document.getElementById("tabsContainer")
        if (tabsContainer === null) return
        let containerXOffset = tabsContainer!.getBoundingClientRect().x

        tabs.forEach((tabType, index) => {
            let tabDiv = document.getElementById(tabType)
            if (tabDiv === null) return
            let divMeasures = tabDiv.getBoundingClientRect()
            divMeasures.x = divMeasures.x - containerXOffset // Extra offset correction

            m.push(divMeasures)
            if (m.length === tabs.length) setMeasures(m)
        })
    }


    return (
        <div className='flex flex-col relative'>
            <div id="tabsContainer" className='flex items-center justify-center'>
                {tabs.map((tabType, index) => {
                    return (
                        <TabCell
                            key={index}
                            type={tabType}
                            link={`/${tabType !== "work" ? tabType + "/" : ""}`}
                            currentMainTab={currentMainTabWithFallback}
                        />
                    )
                })
                }
            </div>

            {(tabs.length === measures.length) &&
                <Indicator
                    tabs={tabs}
                    currentMainTab={currentMainTabWithFallback}
                    measures={measures}
                />
            }
        </div>
    )
}







interface TabCellInterface {
    type: TabType
    link: string
    currentMainTab: TabType
}
{/* A button with the name of the tab. */ }
function TabCell({ type, link, currentMainTab }: TabCellInterface) {


    // States 
    const [isHovered, setIsHovered] = useState(false)


    // Values 
    let isSelectedTab = currentMainTab === type


    return (
        <Link to={link} className="active:bg-gray-100">
            <div id={type} className='justify-center items-center' style={{ paddingLeft: 17, paddingRight: 17, paddingTop: 17, paddingBottom: 17 }} onMouseOver={() => { setIsHovered(true) }} onMouseLeave={() => { setIsHovered(false) }}>
                <p className='text-black' style={Object.assign({}, TextStyles.calloutMedium, {
                    opacity: isHovered || isSelectedTab ? 1 : 0.3
                })}>{getTabDescription(type)}</p>
            </div>
        </Link>
    )
}






interface IndicatorInterface {
    tabs: TabType[]
    currentMainTab: TabType
    measures: DOMRect[]
}
{/* A thick black divider. */ }
function Indicator({ tabs, currentMainTab, measures }: IndicatorInterface) {

    // Values
    let selectedTabIndex = tabs?.findIndex(e => { return e === currentMainTab })
    let matchingTabMeasures = measures[selectedTabIndex]

    return (
        <div className="a absolute left-0 right-0" style={{
            bottom: 0,
            height: 3,
            backgroundColor: colors.black,
            width: matchingTabMeasures.width,
            marginLeft: matchingTabMeasures.x
        }} />
    )
}












export type TabType = 'work' | 'about' | 'contact'
export interface TabData {
    type: TabType
    ref: React.RefObject<any>
}

export interface TabMetadata {
    type: TabType
    name: string
}
export function TabMetadataObj(type: TabType, name: string) {
    return {
        type: type,
        name: name,
    }
}

let tabsMetadata: TabMetadata[] = [
    TabMetadataObj("work", localization.work),
    TabMetadataObj("about", localization.about),
    TabMetadataObj("contact", localization.contact),
]

export function getTabDescription(type: TabType) {
    let tabMetadata = tabsMetadata?.find(e => { return e.type === type })
    return tabMetadata?.name ?? ""
}
