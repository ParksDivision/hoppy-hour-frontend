import React from "react";
import MenuBar from "@/components/MenuBar";
import VenueList from "@/components/VenueList";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DashboardPage: React.FC = () => {
  return (
    <>
      <Header />
      <MenuBar />
      <VenueList />
      <Footer />
    </>
  );
};

export default DashboardPage;