"use client";

import dynamic from "next/dynamic";
import { JSX } from "react";

const CanadaMap = dynamic(() => import("./CanadaMap"), { ssr: false });

export default function MapSection(): JSX.Element {
  return <CanadaMap />;
}
