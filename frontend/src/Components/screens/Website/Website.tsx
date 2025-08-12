import React from 'react'
import { Header } from '../../common/Atoms/WebsiteAtoms/Header'
import Container from '../../common/Atoms/WebsiteAtoms/Container'

const Website = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", width: '100%' ,height:'100vh'}}>
            <Header />
            <Container />
            
        </div>
    )
}

export default Website
