import CherryBlossom from "../portfolio/templates/Cherry_Blossom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import WorldMap from "./WorldMap";
import { AnimatedGradientText, AnimatedLetters } from "./AnimatedText";
import FeaturesCard from "./FeaturesCard";
import AnimatedCounter from "./AnimatedCounter";


const worldMapDots = [
  {
    start: { lat: 64.2008, lng: -149.4937 }, // Alaska
    end: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
  },
  {
    start: { lat: 64.2008, lng: -149.4937 }, // Alaska
    end: { lat: -15.7975, lng: -47.8919 }, // Brazil
  },
  {
    start: { lat: -15.7975, lng: -47.8919 }, // Brazil
    end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
  },
  {
    start: { lat: 51.5074, lng: -0.1278 }, // London
    end: { lat: 28.6139, lng: 77.209 }, // New Delhi
  },
  {
    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
    end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
  },
  {
    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
    end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
  },
  {
    start: { lat: 35.6762, lng: 139.6503 }, // Tokyo
    end: { lat: -33.8688, lng: 151.2093 }, // Sydney
  },
  {
    start: { lat: 40.7128, lng: -74.006 }, // New York
    end: { lat: 51.5074, lng: -0.1278 }, // London
  },
];

export default function HeroSection() {
  return <CherryBlossom />;
}

