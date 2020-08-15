export interface SLVOWIDData {
	"date": string,
	"total_cases": number,
	"new_cases": number,
	"total_deaths": number,
	"new_deaths": number,
	"total_cases_per_million": number,
	"new_cases_per_million": number,
	"total_deaths_per_million": number,
	"new_deaths_per_million": number,
	"new_tests": number,
	"total_tests": number,
	"total_tests_per_thousand": number,
	"new_tests_per_thousand": number,
	"new_tests_smoothed": number,
	"new_tests_smoothed_per_thousand": number,
	"tests_units": string,
	"stringency_index": number
}

export interface SLVOWID {
			"continent": string,
			"location": string,
			"population": number,
			"population_density": number,
			"median_age": number,
			"aged_65_older": number,
			"aged_70_older": number,
			"gdp_per_capita": number,
			"extreme_poverty": number,
			"cardiovasc_death_rate": number,
			"diabetes_prevalence": number,
			"female_smokers": number,
			"male_smokers": number,
			"handwashing_facilities": number,
			"hospital_beds_per_thousand":number,
			"life_expectancy": number,
			"data": SLVOWIDData[]
}