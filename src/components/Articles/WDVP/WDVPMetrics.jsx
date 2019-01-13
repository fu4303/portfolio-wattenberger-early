import React, {Component, PureComponent} from "react"
import * as THREE from "three"
import OrbitControlsGenerator from "three-orbit-controls"
const OrbitControls = OrbitControlsGenerator(THREE)
import TWEEN from "@tweenjs/tween.js"
import * as d3 from "d3"
import { interpolateRdYlGn } from "d3-scale-chromatic"
import classNames from "classnames"
import _ from "lodash"
import { createScale } from 'components/_ui/Chart/utils/scale';
import RadioGroup from 'components/_ui/RadioGroup/RadioGroup';
import Tooltip from 'components/_ui/Tooltip/Tooltip';

// import data from "./WDVP Datasets - the future of government"
import rawData from "./Wdvp_gov_score.json"
import metricsInfo from "./metric-info.json"
import metricRankedCorrelationData from "./Wdvp_corr.json"
// import data from "./WDVP Datasets - small countries are beautiful"
import WDVPScatter from './WDVPScatter'

import './WDVPMetrics.scss'

const ordinalColors = ["#63cdda", "#cf6a87", "#786fa6", "#FDA7DF", "#4b7bec", "#778ca3"]; // "#e77f67", "#778beb", 
const numberFromValue = value =>
  _.isFinite(value) ? value : 
  _.isString(value) ? +value.replace(/,/g, "") :
  null

let continents = [
  {code: "AS", value: "Asia",          color: "#12CBC4"}, // #EF4E78, "#63cdda"
  {code: "EU", value: "Europe",        color: "#B53471"}, // #F99072, "#cf6a87"
  {code: "AF", value: "Africa",        color: "#F79F1F"}, // #FFCA81, "#e77f67"
  {code: "NA", value: "North America", color: "#5758BB"}, // #98C55C, "#FDA7DF"
  {code: "OC", value: "Oceania",       color: "#1289A7"}, // #67B279, "#4b7bec"
  {code: "SA", value: "South America", color: "#A3CB38"}, // #6F87A6, "#778beb"
]
const continentColors = _.fromPairs(_.map(continents, continent => [
  continent.code,
  continent.color,
]))
const blackAndWhiteColorScale = d3.scaleSequential(interpolateRdYlGn)
continents = _.map(continents, (continent, i) => ({...continent, color: d3.interpolatePlasma(i /( continents.length - 1))}))
const continentColorScales = _.fromPairs(
  _.map(continents, continent => [
    continent.code,
    createScale({
      domain: [-0.3, 0.6, 1.2],
      range: ["#fff", continent.color, "#000"],
    }),
  ])
)
const percentileOrRawOptions = [{
  value: true,
  label: "Percentile",
},{
  value: false,
  label: "Value",
}]
const colorModeOptions = [{
  value: "normal",
  label: "All the same",
},{
  value: "continents",
  label: "Continents",
}]
const metrics = _.map(metricRankedCorrelationData, "fieldname")
const filteredMetrics = _.sortBy(
  _.without(_.map(metricRankedCorrelationData, "fieldname"), "Area in km²"),
  _.toLower,
)
const metricCorrelationSorts = _.fromPairs(
  _.map(metricRankedCorrelationData, metric => [
    metric.fieldname,
    metric.RankedCorrelationWithOtherFields,
  ])
)
class WDVPMetrics extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sorts: ["financial freedom score", "women MPs (% of all MPs)"],
      hoveredCountry: null,
      // isAscending: true,
      colorMode: "normal",
      isShowingPercentile: true,
      processedData: [],
    }
  }

  getClassName() {
    return classNames("WDVPMetrics", this.props.className)
  }

  componentDidMount() {
    this.createScales()
  }
  chart = React.createRef()

  createScales = () => {
    const { sorts, selectedContinents, isAscending, isShowingPercentile } = this.state

    const selectedContinentValues = _.map(selectedContinents, "code")

    const sortedData = _.map(sorts, sort => (
      _.orderBy(
        rawData,
        [d => d[sort]],
        ["asc"]
      )
    ))

    const scales = _.fromPairs(
      _.map(metrics, (metric, i) => [
        metric,
        createScale({
          domain: d3.extent(rawData, d => d[metric]),
          range: [0, 1],
        }),
      ])
    )
    this.setState({ scales, processedData: sortedData })
  }

  // onChangeSort = metric => () => metric == this.state.sort ?
  //   this.setState({ isAscending: !this.state.isAscending }, this.createScales) :
  //   this.setState({ sort: metric, isAscending: this.state.isShowingPercentile ? true : false }, this.createScales)
    
  // onContinentsSelect = continents => this.setState({ selectedContinents: continents }, this.createScales)
  // onColorModeOptionsSelect = newVal => this.setState({ colorMode: newVal.value })
  // // onIsShowingPercentileSelect = newVal => this.setState({ isShowingPercentile: newVal.value, isAscending: !this.state.isAscending }, this.createScales)
  // onIsShowingPercentileSelect = newVal => this.setState({ isShowingPercentile: newVal.value }, this.createScales)
  // onCountryHover = country => this.setState({ hoveredCountry: country })

  render() {
    const { processedData, metrics, countryOrder, selectedContinents, scales, sorts, hoveredCountry, colorMode, isAscending, isShowingPercentile } = this.state
    const highlightedCountries = ["United States"]

    return (
      <div className={this.getClassName()}>

        <div className="WDVPMetrics__charts">
          {_.map(sorts, (sort, index) => (
            <WDVPMetricsChart
              data={processedData[index]}
              metric={sort}
              scales={scales}
              highlightedCountries={highlightedCountries}
            />
          ))}
        </div>
          
        {/* <div className="WDVPMap__controls">
          <div className="WDVPMetrics__toggles">
            <RadioGroup
              className="WDVPMetrics__toggle"
              options={percentileOrRawOptions}
              value={isShowingPercentile}
              onChange={this.onIsShowingPercentileSelect}
            />
          
            <RadioGroup
              className="WDVPMetrics__toggle"
              options={colorModeOptions}
              value={colorMode}
              onChange={this.onColorModeOptionsSelect}
            />
          </div>
        
          <div className="WDVPMetrics__metrics">
            {_.map(filteredMetrics, (metric, index) => !!metricsInfo[metric] && (
              <div className={`WDVPMetrics__metrics__item WDVPMetrics__metrics__item--is-${metric == sort ? "selected" : "not-selected"}`} key={metric} onClick={this.onChangeSort(metric)}>
                <div className="WDVPMetrics__metrics__item__label">
                  <span className="WDVPMetrics__metrics__item__index">
                    { index + 1 }.
                  </span>
                  { metric }
                </div>
                {sort == metric && (
                  <div className="WDVPMetrics__metrics__item__details">
                    <div>{ metricsInfo[metric].notes }</div>
                    <div>Source: { metricsInfo[metric].source }, { metricsInfo[metric].year }</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div> */}
        
  
      </div>
    )
  }
}

export default WDVPMetrics


const formatNumber = d3.format(",")
const WDVPMetricsChart = React.memo(({ data, metric, scales, highlightedCountries }) => (
  <div className="WDVPMetricsChart">
    <div className="WDVPMetricsChart__header">
      { metric}
    </div>

    <div className="WDVPMetricsChart__items">
      {_.map(data, country => (
        <div className={`WDVPMetricsChart__item WDVPMetricsChart__item--is-${highlightedCountries.includes(country.Country) ? "selected" : "not-selected"}`} key={country.country}>
          <div className="WDVPMetricsChart__item__bar">
            <div className="WDVPMetricsChart__item__bar__fill" style={{
              height: `${Math.max([
                scales[metric](country[metric]) * 100
              ], 1)}%`,
              // background: continentColors[country.Continent],
            }} />
            <div className="WDVPMetricsChart__item__bar__value">
              { formatNumber(country[metric]) }
            </div>
          </div>
          <div className="WDVPMetricsChart__item__label">
            { country.Country }
          </div>
        </div>
      ))}
    </div>
  </div>
))