
import { groq } from "next-sanity";

export const foods = groq`*[_type=="food"]`;
export const chefs = groq`*[_type=="chef"]`;
export const blogs = groq`*[_type=="blog"]`;
export const order = groq`*[_type=="order"]`;