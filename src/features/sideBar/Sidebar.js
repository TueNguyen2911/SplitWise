import React, { useState } from 'react'
import SquircleContainer from './SquircleContainer';

const SidebarContainer = ({setSBWidth}) => {
    const [groups, setGroups] = useState([
        {name: "Qiqi lovers", img: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Qiyana_0.jpg"}, 
        {name: "Simpson fam", img: "https://upload.wikimedia.org/wikipedia/en/a/aa/Bart_Simpson_200px.png"}
    ])
    return (
        <>
           <SquircleContainer setSBWidth={setSBWidth} groups={groups} />
        </>
    )
}

export default SidebarContainer;
