import { JSX } from "react";
import Hero from "./Hero";
import MapSection from "./MapSection";
import Whyitmatters from "./Whyitmatters";
import WhatToExpect from "./WhatToExpect";
import Cities from "./Cities";
import WhoItsFor from "./WhoItsFor";
import Pastevents from "./Pastevents";

export default function HomePage(): JSX.Element {
  return (
    <>
      <Hero />

      <MapSection />

      <Whyitmatters />
	  
	   <WhoItsFor />

	  <WhatToExpect />

      

      <Cities />


      
     

      <Pastevents />
      

  
      
    </>
  );
}
