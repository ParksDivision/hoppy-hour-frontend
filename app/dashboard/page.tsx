import React from "react"
import MenuBar from "@/components/MenuBar"
import VenueList from "@/components/VenueList"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const DashboardPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAF8]">
            <Header />
            <MenuBar />
            <main className="flex-1 container mx-auto py-6">
                <VenueList />
            </main>
            <Footer />
        </div>
    )
}

export default DashboardPage