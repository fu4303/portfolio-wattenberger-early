import React from "react"
import Day1 from "./sketches/Day1"
import Day2 from "./sketches/Day2"
import Day3 from "./sketches/Day3"
import Day4 from "./sketches/Day4"
import Day5 from "./sketches/Day5"
import Day6 from "./sketches/Day6"
import Day7 from "./sketches/Day7"
import Day8 from "./sketches/Day8"
import Day9 from "./sketches/Day9"
import Day10 from "./sketches/Day10"
import Day11 from "./sketches/Day11"
import Day12 from "./sketches/Day12"
import Day13 from "./sketches/Day13"
import Day14 from "./sketches/Day14"
import Day15 from "./sketches/Day15"
import Day16 from "./sketches/Day16"
import Day17 from "./sketches/Day17"
import Day18 from "./sketches/Day18"
import Day19 from "./sketches/Day19"

export const list = [
  {elem: Day1},
  {elem: Day2},
  {elem: Day3},
  {elem: Day4},
  {elem: Day5},
  {elem: Day6},
  {elem: Day7},
  {elem: Day8, notes: [
    {
      url: "http://creativejs.com/resources/requestanimationframe/",
      title: "Creative JS on requestAnimationFrame",
      points: [
        "Use requestAnimationFrame instead of a timeout/interval because it pays attention to browser events (such as an inactive tab) and waits to render until repaint."
      ],
    }, {
      url: "http://caniuse.com/#feat=requestanimationframe",
      title: "canIUse",
      text: "requestAnimationFrame is browser friendly (other than Opera Mini)"
    }
  ]},
  {elem: Day9},
  {elem: Day10},
  {elem: Day11},
  {elem: Day12},
  {elem: Day13, preventKeyBindings: true},
  {elem: Day14},
  {elem: Day15},
  {elem: Day16},
  {elem: Day17},
  {elem: Day18, notes: [
    {
      url: "https://dribbble.com/shots/1224116-feathers-arrows",
      title: "Inspiration"
    }
  ]},
  {elem: Day19},
  // EOL
]
